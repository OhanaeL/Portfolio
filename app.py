from flask import Flask, render_template, send_from_directory, abort, request, jsonify
import os
import re
from pathlib import Path
from datetime import datetime
import json
import markdown

app = Flask(__name__)
app.config['PUBLIC_FOLDER'] = 'public'
app.config['PROJECTS_FOLDER'] = 'public/projects'
app.config['ACCOMPLISHMENTS_FOLDER'] = 'public/accomplishments'
app.config['WORK_EXPERIENCE_FOLDER'] = 'public/work-experience'
app.config['ABOUT_FOLDER'] = 'public/about'
app.config['CONTACT_LOG'] = 'contact_submissions.json'

def get_project_metadata(project_name):
    """Get metadata for a project from metadata.txt."""
    project_path = Path(app.config['PROJECTS_FOLDER']) / project_name
    metadata_file = project_path / 'metadata.txt'
    
    metadata = {
        'short_description': 'Click to view details',
        'date': '',
        'team': [],
        'tags': [],
        'status': ''
    }
    
    if metadata_file.exists():
        with open(metadata_file, 'r', encoding='utf-8') as f:
            current_key = None
            for line in f:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('description:'):
                    metadata['short_description'] = line.split(':', 1)[1].strip()
                    current_key = None
                elif line.startswith('date:'):
                    metadata['date'] = line.split(':', 1)[1].strip()
                    current_key = None
                elif line.startswith('tags:'):
                    # Tags can be comma-separated on the same line
                    tags_part = line.split(':', 1)[1].strip()
                    if tags_part:
                        metadata['tags'] = [t.strip() for t in tags_part.split(',')]
                    current_key = 'tags'
                elif line.startswith('status:'):
                    metadata['status'] = line.split(':', 1)[1].strip()
                    current_key = None
                elif line.startswith('team:'):
                    current_key = 'team'
                elif current_key == 'team' and line.startswith('- '):
                    metadata['team'].append(line[2:].strip())
                elif current_key == 'tags' and line.startswith('- '):
                    metadata['tags'].append(line[2:].strip())
    
    return metadata

def get_all_projects():
    """Get all project folders and their metadata, ordered by order.txt."""
    projects = []
    projects_path = Path(app.config['PROJECTS_FOLDER'])
    
    if not projects_path.exists():
        return projects
    
    # Check for order.txt
    order_file = projects_path / 'order.txt'
    project_order = []
    
    if order_file.exists():
        with open(order_file, 'r', encoding='utf-8') as f:
            project_order = [line.strip() for line in f.readlines() if line.strip()]
    
    # Get all available projects
    available_projects = {}
    for folder in projects_path.iterdir():
        if folder.is_dir():
            metadata = get_project_metadata(folder.name)
            available_projects[folder.name] = {
                'name': folder.name,
                'slug': folder.name.lower().replace(' ', '-'),
                'metadata': metadata
            }
    
    # If order.txt exists, only include projects listed there in that order
    if project_order:
        for project_name in project_order:
            if project_name in available_projects:
                projects.append(available_projects[project_name])
    else:
        # No order.txt, use alphabetical order
        for folder_name in sorted(available_projects.keys()):
            projects.append(available_projects[folder_name])
    
    return projects

def process_markdown(text):
    """Process Markdown syntax while protecting custom HTML tags."""
    # Protect our custom HTML tags from Markdown processing
    placeholders = {}
    placeholder_counter = 0
    
    def create_placeholder(html):
        nonlocal placeholder_counter
        # Wrap in backticks so Markdown treats it as inline code and preserves it exactly
        key = f"`PROTECTEDHTML{placeholder_counter}`"
        placeholder_counter += 1
        placeholders[key] = html
        return key
    
    # Protect image hover triggers and project links
    protected_patterns = [
        (r'<span class="image-hover-trigger"[^>]*>.*?</span>', create_placeholder),
        (r'<a href="/project/[^"]*"[^>]*>.*?</a>', create_placeholder),
        (r'<a href="/accomplishment-image/[^"]*"[^>]*>.*?</a>', create_placeholder),
    ]
    
    # Replace protected HTML with placeholders
    for pattern, replacer in protected_patterns:
        def make_replacer(placeholder_func):
            def repl(match):
                return placeholder_func(match.group(0))
            return repl
        text = re.sub(pattern, make_replacer(replacer), text, flags=re.DOTALL)
    
    # Now process Markdown
    text = markdown.markdown(
        text,
        extensions=['extra', 'nl2br'],
        output_format='html5'
    )
    
    # Restore protected HTML tags
    # Markdown converts backticks to <code> tags, so we need to find those
    import html
    import re as re_module
    for placeholder, original_html in placeholders.items():
        # The placeholder was wrapped in backticks, so Markdown converted it to <code>PROTECTEDHTML0</code>
        # Extract the number from the placeholder
        match = re_module.search(r'PROTECTEDHTML(\d+)', placeholder)
        if match:
            num = match.group(1)
            # Look for <code>PROTECTEDHTML{num}</code> in the output
            code_pattern = f'<code>PROTECTEDHTML{num}</code>'
            text = text.replace(code_pattern, original_html)
            # Also try with escaped HTML
            escaped_code = html.escape(code_pattern)
            if escaped_code in text:
                text = text.replace(escaped_code, original_html)
    
    return text

def parse_project(project_name):
    """Parse a project folder and return its content."""
    project_path = Path(app.config['PROJECTS_FOLDER']) / project_name
    
    if not project_path.exists():
        return None
    
    # Find the description .txt file
    txt_files = list(project_path.glob('*.txt'))
    description = ""
    
    if txt_files:
        with open(txt_files[0], 'r', encoding='utf-8') as f:
            description = f.read()
    
    # Get all images from the images folder
    images_path = project_path / 'images'
    all_images = []
    used_images = set()
    
    if images_path.exists():
        for img in images_path.glob('*'):
            if img.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']:
                all_images.append(img.name)
    
    # Parse [image:filename:text] tags and replace them with hoverable text
    def replace_image_tag(match):
        parts = match.group(1).split(':', 1)
        image_name = parts[0].strip()
        hover_text = parts[1].strip() if len(parts) > 1 else image_name
        used_images.add(image_name)
        return f'<span class="image-hover-trigger" data-image="/project-image/{project_name}/images/{image_name}">{hover_text}</span>'
    
    description_html = re.sub(r'\[image:([^\]]+)\]', replace_image_tag, description)
    
    # Parse [website_link:Project Name] tags for cross-linking
    def replace_project_link(match):
        linked_project = match.group(1)
        return f'<a href="/project/{linked_project}" class="project-link">{linked_project}</a>'
    
    description_html = re.sub(r'\[website_link:([^\]]+)\]', replace_project_link, description_html)
    
    # Parse Markdown (headers, bold, italic, lists, etc.)
    description_html = process_markdown(description_html)
    
    # Get ALL images for carousel
    carousel_images = []
    
    # Check for image_titles.txt for custom titles and descriptions
    image_data = {}
    titles_file = project_path / 'images' / 'image_titles.txt'
    if titles_file.exists():
        with open(titles_file, 'r', encoding='utf-8') as f:
            for line in f:
                if ':' in line:
                    parts = line.split(':', 1)
                    img_name = parts[0].strip()
                    rest = parts[1].strip()
                    
                    # Check if there's a description separated by |
                    if '|' in rest:
                        title, description = rest.split('|', 1)
                        image_data[img_name] = {
                            'title': title.strip(),
                            'description': description.strip()
                        }
                    else:
                        image_data[img_name] = {
                            'title': rest,
                            'description': ''
                        }
    
    for img in all_images:
        # Use custom data if available, otherwise use filename without extension
        if img in image_data:
            title = image_data[img]['title']
            description = image_data[img]['description']
        else:
            title = Path(img).stem.replace('_', ' ').replace('-', ' ').title()
            description = ''
        
        carousel_images.append({
            'filename': img,
            'title': title,
            'description': description
        })
    
    # Get embeds (PDFs and YouTube videos)
    embeds = {'pdfs': [], 'videos': []}
    embeds_path = project_path / 'embeds'
    
    if embeds_path.exists():
        # Get all PDF files
        for pdf in embeds_path.glob('*.pdf'):
            embeds['pdfs'].append({
                'filename': pdf.name,
                'title': pdf.stem.replace('_', ' ').replace('-', ' ').title()
            })
        
        # Check for videos.txt with YouTube URLs
        videos_file = embeds_path / 'videos.txt'
        if videos_file.exists():
            with open(videos_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith('#'):
                        continue
                    
                    # Parse format: URL | Title
                    if '|' in line:
                        url, title = line.split('|', 1)
                        url = url.strip()
                        title = title.strip()
                    else:
                        url = line
                        title = 'Video'
                    
                    # Extract YouTube video ID
                    video_id = None
                    if 'youtube.com/watch?v=' in url:
                        video_id = url.split('watch?v=')[1].split('&')[0]
                    elif 'youtu.be/' in url:
                        video_id = url.split('youtu.be/')[1].split('?')[0]
                    
                    if video_id:
                        embeds['videos'].append({
                            'id': video_id,
                            'title': title
                        })
    
    # Get project metadata for display on project page
    metadata = get_project_metadata(project_name)
    
    return {
        'name': project_name,
        'description': description_html,
        'images': carousel_images,
        'embeds': embeds,
        'metadata': metadata
    }

@app.route('/')
def index():
    """Homepage with top 3 projects."""
    all_projects = get_all_projects()
    # Show only top 3 projects on home page
    top_projects = all_projects[:3] if len(all_projects) > 3 else all_projects
    return render_template('index.html', projects=top_projects, all_projects=all_projects)

@app.route('/projects')
def projects():
    """All projects page with search and filter."""
    all_projects = get_all_projects()
    return render_template('projects.html', projects=all_projects, all_projects=all_projects)

@app.route('/project/<project_name>')
def project_detail(project_name):
    """Individual project page."""
    project = parse_project(project_name)
    
    if not project:
        abort(404)
    
    all_projects = get_all_projects()
    
    # Find current project index and calculate next/prev
    project_names = [p['name'] for p in all_projects]
    current_index = -1
    
    try:
        current_index = project_names.index(project_name)
    except ValueError:
        pass
    
    # Calculate next and previous projects (with looping)
    next_project = None
    prev_project = None
    
    if current_index >= 0 and len(all_projects) > 1:
        next_index = (current_index + 1) % len(all_projects)
        prev_index = (current_index - 1) % len(all_projects)
        next_project = all_projects[next_index]
        prev_project = all_projects[prev_index]
    
    return render_template('project.html', 
                         project=project, 
                         all_projects=all_projects,
                         next_project=next_project,
                         prev_project=prev_project)

@app.route('/project-image/<path:filepath>')
def project_image(filepath):
    """Serve project images."""
    full_path = os.path.join(app.config['PROJECTS_FOLDER'], filepath)
    directory = os.path.dirname(full_path)
    filename = os.path.basename(full_path)
    return send_from_directory(directory, filename)

@app.route('/project-embed/<project_name>/<filename>')
def project_embed(project_name, filename):
    """Serve project embed files (PDFs, etc.)."""
    embed_path = os.path.join(app.config['PROJECTS_FOLDER'], project_name, 'embeds')
    return send_from_directory(embed_path, filename)

@app.route('/credits')
def credits():
    """Credits page."""
    all_projects = get_all_projects()
    return render_template('credits.html', all_projects=all_projects)

def get_all_accomplishments():
    """Get all journey entry folders sorted by order.txt or year (newest first)."""
    accomplishments = []
    accomplishments_path = Path(app.config['ACCOMPLISHMENTS_FOLDER'])
    
    if not accomplishments_path.exists():
        return accomplishments
    
    # Check for order.txt file
    order_file = accomplishments_path / 'order.txt'
    if order_file.exists():
        with open(order_file, 'r', encoding='utf-8') as f:
            ordered_names = [line.strip() for line in f.readlines() if line.strip()]
        
        # Only include accomplishments that are in the order file
        for folder_name in ordered_names:
            folder_path = accomplishments_path / folder_name
            if folder_path.is_dir():
                # Extract year/date by splitting on '-'
                # Everything before the first '-' is considered the date/year
                year_display = None
                if ' - ' in folder_name:
                    year_display = folder_name.split(' - ')[0].strip()
                
                accomplishments.append({
                    'name': folder_name,
                    'year': year_display,
                    'slug': folder_name.lower().replace(' ', '-')
                })
    else:
        # Fallback to scanning all folders
        for folder in accomplishments_path.iterdir():
            if folder.is_dir():
                folder_name = folder.name
                # Extract year/date by splitting on '-'
                year_display = None
                if ' - ' in folder_name:
                    year_display = folder_name.split(' - ')[0].strip()
                
                accomplishments.append({
                    'name': folder_name,
                    'year': year_display,
                    'slug': folder_name.lower().replace(' ', '-')
                })
        
        # Sort by year/date (newest first), then by name
        # Try to extract numeric year for sorting, fallback to string comparison
        def sort_key(acc):
            if acc['year']:
                # Try to extract a 4-digit year for proper sorting
                year_match = re.search(r'(\d{4})', acc['year'])
                if year_match:
                    return (int(year_match.group(1)), acc['name'])
                return (0, acc['year'], acc['name'])
            return (0, '', acc['name'])
        
        accomplishments.sort(key=sort_key, reverse=True)
    
    return accomplishments

def parse_accomplishment(accomplishment_name):
    """Parse a journey entry folder and return its content."""
    accomplishment_path = Path(app.config['ACCOMPLISHMENTS_FOLDER']) / accomplishment_name
    
    if not accomplishment_path.exists():
        return None
    
    # Find the description .txt file
    txt_files = list(accomplishment_path.glob('*.txt'))
    description = ""
    
    if txt_files:
        with open(txt_files[0], 'r', encoding='utf-8') as f:
            description = f.read()
    
    # Get all images from the images folder
    images_path = accomplishment_path / 'images'
    all_images = []
    used_images = set()
    
    if images_path.exists():
        for img in images_path.glob('*'):
            if img.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']:
                all_images.append(img.name)
    
    # Parse [image:filename:text] tags and replace them with hoverable text
    def replace_image_tag(match):
        parts = match.group(1).split(':', 1)
        image_name = parts[0].strip()
        hover_text = parts[1].strip() if len(parts) > 1 else image_name
        used_images.add(image_name)
        return f'<span class="image-hover-trigger" data-image="/accomplishment-image/{accomplishment_name}/images/{image_name}">{hover_text}</span>'
    
    description_html = re.sub(r'\[image:([^\]]+)\]', replace_image_tag, description)
    
    # Parse [website_link:Project Name] tags and replace them
    def replace_project_link(match):
        project_name = match.group(1)
        return f'<a href="/project/{project_name}" class="project-link">{project_name}</a>'
    
    description_html = re.sub(r'\[website_link:([^\]]+)\]', replace_project_link, description_html)
    
    # Parse Markdown (headers, bold, italic, lists, etc.)
    description_html = process_markdown(description_html)
    
    # Get ALL images for carousel
    carousel_images = []
    
    # Check for image_titles.txt for custom titles and descriptions
    image_data = {}
    titles_file = accomplishment_path / 'images' / 'image_titles.txt'
    if titles_file.exists():
        with open(titles_file, 'r', encoding='utf-8') as f:
            for line in f:
                if ':' in line:
                    parts = line.split(':', 1)
                    img_name = parts[0].strip()
                    rest = parts[1].strip()
                    
                    # Check if there's a description separated by |
                    if '|' in rest:
                        title, description = rest.split('|', 1)
                        image_data[img_name] = {
                            'title': title.strip(),
                            'description': description.strip()
                        }
                    else:
                        image_data[img_name] = {
                            'title': rest,
                            'description': ''
                        }
    
    for img in all_images:
        # Use custom data if available, otherwise use filename without extension
        if img in image_data:
            title = image_data[img]['title']
            description = image_data[img]['description']
        else:
            title = Path(img).stem.replace('_', ' ').replace('-', ' ').title()
            description = ''
        
        carousel_images.append({
            'filename': img,
            'title': title,
            'description': description,
            'alt': title  # Add alt for template compatibility
        })
    
    # Parse embeds (videos and PDFs)
    embeds = {
        'videos': [],
        'pdfs': []
    }
    
    # Check for videos.txt
    embeds_path = accomplishment_path / 'embeds'
    videos_file = embeds_path / 'videos.txt'
    if videos_file.exists():
        with open(videos_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and '|' in line:
                    url, title = line.split('|', 1)
                    url = url.strip()
                    title = title.strip()
                    
                    # Extract YouTube video ID
                    if 'youtube.com/watch?v=' in url:
                        video_id = url.split('v=')[1].split('&')[0]
                    elif 'youtu.be/' in url:
                        video_id = url.split('youtu.be/')[1].split('?')[0]
                    else:
                        continue
                    
                    embeds['videos'].append({
                        'id': video_id,
                        'title': title
                    })
    
    # Check for PDF files in embeds folder
    if embeds_path.exists():
        for file in embeds_path.glob('*.pdf'):
            embeds['pdfs'].append({
                'filename': file.name,
                'title': file.stem.replace('_', ' ').replace('-', ' ').title()
            })
    
    # Extract just the text after " - " from the accomplishment name
    display_name = accomplishment_name.split(' - ', 1)[1] if ' - ' in accomplishment_name else accomplishment_name
    
    return {
        'name': display_name,
        'description': description_html,
        'images': carousel_images,
        'embeds': embeds
    }

def get_all_work_experiences():
    """Get all work experience folders, ordered by order.txt."""
    work_experiences = []
    work_experience_path = Path(app.config['WORK_EXPERIENCE_FOLDER'])
    
    if not work_experience_path.exists():
        return work_experiences
    
    # Check for order.txt
    order_file = work_experience_path / 'order.txt'
    ordered_names = []
    
    if order_file.exists():
        with open(order_file, 'r', encoding='utf-8') as f:
            ordered_names = [line.strip() for line in f.readlines() if line.strip()]
        
        # Only include work experiences that are in the order file
        for folder_name in ordered_names:
            folder_path = work_experience_path / folder_name
            if folder_path.is_dir():
                # Extract date by splitting on '-'
                date_display = None
                if ' - ' in folder_name:
                    date_display = folder_name.split(' - ')[0].strip()
                
                work_experiences.append({
                    'name': folder_name,
                    'date': date_display,
                    'slug': folder_name.lower().replace(' ', '-')
                })
    else:
        # Fallback to scanning all folders
        for folder in work_experience_path.iterdir():
            if folder.is_dir():
                folder_name = folder.name
                # Extract date by splitting on '-'
                date_display = None
                if ' - ' in folder_name:
                    date_display = folder_name.split(' - ')[0].strip()
                
                work_experiences.append({
                    'name': folder_name,
                    'date': date_display,
                    'slug': folder_name.lower().replace(' ', '-')
                })
        
        # Sort by date (newest first), then by name
        def sort_key(exp):
            if exp['date']:
                # Try to extract a 4-digit year for proper sorting
                year_match = re.search(r'(\d{4})', exp['date'])
                if year_match:
                    return (int(year_match.group(1)), exp['name'])
                return (0, exp['date'], exp['name'])
            return (0, '', exp['name'])
        
        work_experiences.sort(key=sort_key, reverse=True)
    
    return work_experiences

def get_work_experience_metadata(experience_name):
    """Get metadata for a work experience from metadata.txt."""
    experience_path = Path(app.config['WORK_EXPERIENCE_FOLDER']) / experience_name
    metadata_file = experience_path / 'metadata.txt'
    
    metadata = {
        'short_description': 'Click to view details',
        'date': '',
        'company': ''
    }
    
    if metadata_file.exists():
        with open(metadata_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('description:'):
                    metadata['short_description'] = line.split(':', 1)[1].strip()
                elif line.startswith('date:'):
                    metadata['date'] = line.split(':', 1)[1].strip()
                elif line.startswith('company:'):
                    metadata['company'] = line.split(':', 1)[1].strip()
    
    return metadata

def parse_work_experience(experience_name):
    """Parse a work experience folder and return its content."""
    experience_path = Path(app.config['WORK_EXPERIENCE_FOLDER']) / experience_name
    
    if not experience_path.exists():
        return None
    
    # Get metadata
    metadata = get_work_experience_metadata(experience_name)
    
    # Find the description .txt file
    txt_files = list(experience_path.glob('*.txt'))
    description = ""
    
    # Skip metadata.txt when looking for description
    description_files = [f for f in txt_files if f.name != 'metadata.txt']
    
    if description_files:
        with open(description_files[0], 'r', encoding='utf-8') as f:
            description = f.read()
    
    # Get all images from the images folder
    images_path = experience_path / 'images'
    all_images = []
    used_images = set()
    
    if images_path.exists():
        for img in images_path.glob('*'):
            if img.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']:
                all_images.append(img.name)
    
    # Parse [image:filename:text] tags and replace them with hoverable text
    def replace_image_tag(match):
        parts = match.group(1).split(':', 1)
        image_name = parts[0].strip()
        hover_text = parts[1].strip() if len(parts) > 1 else image_name
        used_images.add(image_name)
        return f'<span class="image-hover-trigger" data-image="/work-experience-image/{experience_name}/images/{image_name}">{hover_text}</span>'
    
    description_html = re.sub(r'\[image:([^\]]+)\]', replace_image_tag, description)
    
    # Parse [website_link:Project Name] tags and replace them
    def replace_project_link(match):
        project_name = match.group(1)
        return f'<a href="/project/{project_name}" class="project-link">{project_name}</a>'
    
    description_html = re.sub(r'\[website_link:([^\]]+)\]', replace_project_link, description_html)
    
    # Parse Markdown (headers, bold, italic, lists, etc.)
    description_html = process_markdown(description_html)
    
    # Get ALL images for carousel
    carousel_images = []
    
    # Check for image_titles.txt for custom titles and descriptions
    image_data = {}
    titles_file = experience_path / 'images' / 'image_titles.txt'
    if titles_file.exists():
        with open(titles_file, 'r', encoding='utf-8') as f:
            for line in f:
                if ':' in line:
                    parts = line.split(':', 1)
                    img_name = parts[0].strip()
                    rest = parts[1].strip()
                    
                    # Check if there's a description separated by |
                    if '|' in rest:
                        title, description = rest.split('|', 1)
                        image_data[img_name] = {
                            'title': title.strip(),
                            'description': description.strip()
                        }
                    else:
                        image_data[img_name] = {
                            'title': rest,
                            'description': ''
                        }
    
    for img in all_images:
        # Use custom data if available, otherwise use filename without extension
        if img in image_data:
            title = image_data[img]['title']
            description = image_data[img]['description']
        else:
            title = Path(img).stem.replace('_', ' ').replace('-', ' ').title()
            description = ''
        
        carousel_images.append({
            'filename': img,
            'title': title,
            'description': description
        })
    
    # Get embeds (PDFs and YouTube videos)
    embeds = {'pdfs': [], 'videos': []}
    embeds_path = experience_path / 'embeds'
    
    # Check for videos.txt
    videos_file = embeds_path / 'videos.txt'
    if videos_file.exists():
        with open(videos_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and '|' in line:
                    url, title = line.split('|', 1)
                    url = url.strip()
                    title = title.strip()
                    
                    # Extract YouTube video ID
                    if 'youtube.com/watch?v=' in url:
                        video_id = url.split('v=')[1].split('&')[0]
                    elif 'youtu.be/' in url:
                        video_id = url.split('youtu.be/')[1].split('?')[0]
                    else:
                        continue
                    
                    embeds['videos'].append({
                        'id': video_id,
                        'title': title
                    })
    
    # Check for PDF files in embeds folder
    if embeds_path.exists():
        for file in embeds_path.glob('*.pdf'):
            embeds['pdfs'].append({
                'filename': file.name,
                'title': file.stem.replace('_', ' ').replace('-', ' ').title()
            })
    
    # Extract just the text after " - " from the experience name
    display_name = experience_name.split(' - ', 1)[1] if ' - ' in experience_name else experience_name
    
    return {
        'name': display_name,
        'folder_name': experience_name,  # Full folder name for image paths
        'description': description_html,
        'images': carousel_images,
        'embeds': embeds,
        'metadata': metadata
    }

@app.route('/timeline')
def timeline():
    """My Journey page with all journey entries."""
    accomplishments = get_all_accomplishments()
    all_projects = get_all_projects()
    
    # Parse all journey entries for the timeline view
    parsed_accomplishments = []
    for acc in accomplishments:
        parsed = parse_accomplishment(acc['name'])
        if parsed:
            parsed['year'] = acc['year']
            parsed_accomplishments.append(parsed)
    
    return render_template('timeline.html', accomplishments=parsed_accomplishments, all_projects=all_projects)

@app.route('/work-experience')
def work_experience():
    """Work Experience page with all work experience entries."""
    experiences = get_all_work_experiences()
    all_projects = get_all_projects()
    
    # Get metadata for list view (don't parse full descriptions)
    experience_list = []
    seen_roles = set()  # Track unique roles to ensure only one entry per role
    
    for exp in experiences:
        metadata = get_work_experience_metadata(exp['name'])
        display_name = exp['name'].split(' - ', 1)[1] if ' - ' in exp['name'] else exp['name']
        
        # Extract role title (the part after "at" or just use display_name)
        # Normalize to lowercase for comparison
        role_key = display_name.lower().strip()
        
        # Only add if we haven't seen this role before
        if role_key and role_key not in seen_roles:
            seen_roles.add(role_key)
            experience_list.append({
                'name': exp['name'],
                'display_name': display_name,
                'date': exp['date'] or metadata['date'],
                'metadata': metadata
            })
    
    return render_template('work-experience.html', experiences=experience_list, all_projects=all_projects)

@app.route('/work-experience/<experience_name>')
def work_experience_detail(experience_name):
    """Individual work experience detail page."""
    experience = parse_work_experience(experience_name)
    
    if not experience:
        abort(404)
    
    all_projects = get_all_projects()
    all_experiences = get_all_work_experiences()
    
    # Find current experience index and calculate next/prev
    experience_names = [exp['name'] for exp in all_experiences]
    current_index = -1
    
    try:
        current_index = experience_names.index(experience_name)
    except ValueError:
        pass
    
    # Calculate next and previous experiences (with looping)
    next_experience = None
    prev_experience = None
    
    if current_index >= 0 and len(all_experiences) > 1:
        next_index = (current_index + 1) % len(all_experiences)
        prev_index = (current_index - 1) % len(all_experiences)
        next_experience = all_experiences[next_index]
        prev_experience = all_experiences[prev_index]
    
    return render_template('work-experience-detail.html', 
                         experience=experience, 
                         all_projects=all_projects,
                         next_experience=next_experience,
                         prev_experience=prev_experience)

@app.route('/work-experience-image/<path:filepath>')
def work_experience_image(filepath):
    """Serve work experience images."""
    full_path = os.path.join(app.config['WORK_EXPERIENCE_FOLDER'], filepath)
    directory = os.path.dirname(full_path)
    filename = os.path.basename(full_path)
    return send_from_directory(directory, filename)

@app.route('/work-experience-embed/<experience_name>/<filename>')
def work_experience_embed(experience_name, filename):
    """Serve embed files (PDFs) for work experience entries."""
    embeds_folder = os.path.join(app.config['WORK_EXPERIENCE_FOLDER'], experience_name, 'embeds')
    return send_from_directory(embeds_folder, filename)

@app.route('/accomplishment-image/<path:filepath>')
def accomplishment_image(filepath):
    """Serve journey entry images."""
    full_path = os.path.join(app.config['ACCOMPLISHMENTS_FOLDER'], filepath)
    directory = os.path.dirname(full_path)
    filename = os.path.basename(full_path)
    return send_from_directory(directory, filename)

@app.route('/accomplishment-embed/<accomplishment_name>/<filename>')
def accomplishment_embed(accomplishment_name, filename):
    """Serve embed files (PDFs) for journey entries."""
    embeds_folder = os.path.join(app.config['ACCOMPLISHMENTS_FOLDER'], accomplishment_name, 'embeds')
    return send_from_directory(embeds_folder, filename)

def parse_about():
    """Parse the about folder for sections and skills."""
    about_path = Path(app.config['ABOUT_FOLDER'])
    
    if not about_path.exists():
        return {'ordered_sections': [], 'skills': [], 'resume': None}
    
    sections = []
    skills = []
    section_order = []
    info = {}
    
    # Parse info.txt for name and birthdate
    info_file = about_path / 'info.txt'
    if info_file.exists():
        from datetime import datetime
        with open(info_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip().lower()
                    value = value.strip()
                    info[key] = value
        
        # Calculate age from birthdate if provided
        if 'birthdate' in info:
            try:
                birthdate = datetime.strptime(info['birthdate'], '%Y-%m-%d')
                today = datetime.now()
                age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
                info['age'] = age
            except:
                pass
    
    # Check for profile picture
    profile_pic = None
    pic_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    for ext in pic_extensions:
        pic_path = about_path / f'profile{ext}'
        if pic_path.exists():
            profile_pic = f'profile{ext}'
            break
    
    info['profile_pic'] = profile_pic
    
    # Check for order.txt to determine section order
    order_file = about_path / 'order.txt'
    if order_file.exists():
        with open(order_file, 'r', encoding='utf-8') as f:
            section_order = [line.strip() for line in f.readlines() if line.strip()]
    
    # Get all .txt files except order.txt and info.txt
    txt_files = [f for f in about_path.glob('*.txt') if f.stem not in ['order', 'info']]
    
    # Create a dict of sections by filename
    sections_dict = {}
    for txt_file in txt_files:
        filename = txt_file.stem
        # Format: remove underscores, convert to uppercase
        title = filename.replace('_', ' ').upper()
        
        with open(txt_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert newlines to paragraphs
        content_html = content.replace('\n\n', '</p><p>')
        content_html = f'<p>{content_html}</p>'
        
        sections_dict[filename] = {
            'title': title,
            'content': content_html
        }
    
    # Parse skills.csv if it exists
    skills_file = about_path / 'skills.csv'
    has_skills = False
    if skills_file.exists():
        has_skills = True
        import csv
        with open(skills_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                skill = {
                    'name': row.get('name', ''),
                    'max': int(row.get('max', 100)),
                    'min': int(row.get('min', 0)),
                    'score': int(row.get('score', 0)),
                    'label': row.get('label', ''),
                    'year': row.get('year', '')
                }
                # Calculate percentage
                skill['percentage'] = ((skill['score'] - skill['min']) / (skill['max'] - skill['min'])) * 100
                skills.append(skill)
    
    # Order sections based on order.txt if it exists
    ordered_sections = []
    if section_order:
        for section_name in section_order:
            if section_name == 'skills' and has_skills:
                # Add skills placeholder
                ordered_sections.append({'type': 'skills'})
            elif section_name == 'certificates':
                # Add certificates placeholder
                ordered_sections.append({'type': 'certificates'})
            elif section_name in sections_dict:
                ordered_sections.append({'type': 'section', 'data': sections_dict[section_name]})
        
        # Add any remaining sections not in order.txt
        for filename, section_data in sorted(sections_dict.items()):
            if filename not in section_order:
                ordered_sections.append({'type': 'section', 'data': section_data})
        
        # If skills not in order and exists, add at end
        if has_skills and 'skills' not in section_order:
            ordered_sections.append({'type': 'skills'})
        
        # If certificates not in order, add at end
        if 'certificates' not in section_order:
            ordered_sections.append({'type': 'certificates'})
    else:
        # No order file, use alphabetical order + skills at end + certificates at end
        for filename in sorted(sections_dict.keys()):
            ordered_sections.append({'type': 'section', 'data': sections_dict[filename]})
        if has_skills:
            ordered_sections.append({'type': 'skills'})
        ordered_sections.append({'type': 'certificates'})
    
    # Check for resume file
    resume_file = None
    resume_extensions = ['.pdf', '.doc', '.docx']
    for ext in resume_extensions:
        resume_path = about_path / f'resume{ext}'
        if resume_path.exists():
            resume_file = f'resume{ext}'
            break
    
    # Get certificates from certificates folder
    certificates = []
    certificates_path = about_path / 'certificates'
    certificates_info_file = certificates_path / 'certificates.txt'
    
    if certificates_path.exists() and certificates_path.is_dir():
        # Parse certificates.txt for metadata and order
        certificates_metadata = {}
        certificate_order = []  # Store order from certificates.txt
        
        if certificates_info_file.exists():
            with open(certificates_info_file, 'r', encoding='utf-8') as f:
                current_cert = {}
                for line in f:
                    line = line.strip()
                    if not line:
                        # Empty line indicates end of a certificate entry
                        if current_cert.get('filename'):
                            filename = current_cert['filename']
                            certificates_metadata[filename] = current_cert
                            certificate_order.append(filename)  # Preserve order
                        current_cert = {}
                    elif ':' in line:
                        key, value = line.split(':', 1)
                        current_cert[key.strip().lower()] = value.strip()
                
                # Don't forget the last certificate
                if current_cert.get('filename'):
                    filename = current_cert['filename']
                    certificates_metadata[filename] = current_cert
                    certificate_order.append(filename)  # Preserve order
        
        # Get all certificate files
        cert_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
        all_cert_files = {}
        
        # First, collect all certificate files
        for cert_file in certificates_path.iterdir():
            if cert_file.is_file() and cert_file.suffix.lower() in cert_extensions:
                filename = cert_file.name
                all_cert_files[filename] = cert_file
        
        # Add certificates in the order from certificates.txt
        for filename in certificate_order:
            if filename in all_cert_files:
                cert_file = all_cert_files[filename]
                meta = certificates_metadata.get(filename, {})
                certificates.append({
                    'filename': filename,
                    'title': meta.get('title', cert_file.stem.replace('_', ' ').replace('-', ' ').title()),
                    'description': meta.get('description', ''),
                    'year': meta.get('year', ''),
                    'from': meta.get('from', ''),
                    'verification': meta.get('verification', '')
                })
        
        # Add any remaining certificate files not in certificates.txt (alphabetically)
        remaining_files = [f for f in all_cert_files.keys() if f not in certificate_order]
        for filename in sorted(remaining_files):
            cert_file = all_cert_files[filename]
            meta = certificates_metadata.get(filename, {})
            certificates.append({
                'filename': filename,
                'title': meta.get('title', cert_file.stem.replace('_', ' ').replace('-', ' ').title()),
                'description': meta.get('description', ''),
                'year': meta.get('year', ''),
                'from': meta.get('from', ''),
                'verification': meta.get('verification', '')
            })
    
    return {
        'ordered_sections': ordered_sections,
        'skills': skills,
        'resume': resume_file,
        'info': info,
        'certificates': certificates
    }

@app.route('/about')
def about():
    """About me page."""
    about_data = parse_about()
    all_projects = get_all_projects()
    return render_template('about.html', about=about_data, all_projects=all_projects)

@app.route('/resume/<filename>')
def serve_resume(filename):
    """Serve resume file."""
    return send_from_directory(app.config['ABOUT_FOLDER'], filename)

@app.route('/profile-pic/<filename>')
def serve_profile_pic(filename):
    """Serve profile picture."""
    return send_from_directory(app.config['ABOUT_FOLDER'], filename)

@app.route('/certificate/<filename>')
def serve_certificate(filename):
    """Serve certificate file."""
    certificates_path = Path(app.config['ABOUT_FOLDER']) / 'certificates'
    return send_from_directory(certificates_path, filename)

@app.route('/robots.txt')
def robots():
    """Serve robots.txt."""
    return send_from_directory(app.static_folder, 'robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    """Generate dynamic sitemap."""
    pages = []
    base_url = request.url_root.rstrip('/')
    
    # Add static pages
    pages.append({'loc': f'{base_url}/', 'changefreq': 'weekly', 'priority': '1.0'})
    pages.append({'loc': f'{base_url}/projects', 'changefreq': 'weekly', 'priority': '0.9'})
    pages.append({'loc': f'{base_url}/timeline', 'changefreq': 'weekly', 'priority': '0.8'})
    pages.append({'loc': f'{base_url}/work-experience', 'changefreq': 'monthly', 'priority': '0.8'})
    pages.append({'loc': f'{base_url}/about', 'changefreq': 'monthly', 'priority': '0.8'})
    pages.append({'loc': f'{base_url}/credits', 'changefreq': 'yearly', 'priority': '0.3'})
    
    # Add project pages
    projects = get_all_projects()
    for project in projects:
        pages.append({
            'loc': f'{base_url}/project/{project["name"]}',
            'changefreq': 'monthly',
            'priority': '0.9'
        })
    
    # Generate XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for page in pages:
        xml += '  <url>\n'
        xml += f'    <loc>{page["loc"]}</loc>\n'
        xml += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
        xml += f'    <priority>{page["priority"]}</priority>\n'
        xml += '  </url>\n'
    xml += '</urlset>'
    
    return xml, 200, {'Content-Type': 'application/xml'}

@app.route('/contact', methods=['POST'])
def contact_form():
    """Handle contact form submissions."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
        
        # Create submission record
        submission = {
            'timestamp': datetime.now().isoformat(),
            'name': data['name'],
            'email': data['email'],
            'subject': data['subject'],
            'message': data['message']
        }
        
        # Save to JSON file (simple storage)
        log_file = app.config['CONTACT_LOG']
        submissions = []
        
        if os.path.exists(log_file):
            with open(log_file, 'r', encoding='utf-8') as f:
                submissions = json.load(f)
        
        submissions.append(submission)
        
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(submissions, f, indent=2, ensure_ascii=False)
        
        # In a real application, you would send an email here
        # For now, we just log it to a file
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! I\'ll get back to you soon.'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred. Please try again or email directly.'
        }), 500

if __name__ == '__main__':
    # Create folders if they don't exist
    os.makedirs(app.config['PUBLIC_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PROJECTS_FOLDER'], exist_ok=True)
    os.makedirs(app.config['ACCOMPLISHMENTS_FOLDER'], exist_ok=True)
    os.makedirs(app.config['ABOUT_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)

