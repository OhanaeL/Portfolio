# Portfolio Website

A beautiful, dynamic portfolio website built with Flask that automatically generates project pages from folders containing text files and images.

## Features

- 🎨 Beautiful purple and dark theme with pixel art elements
- 📁 Folder-based project management
- 🖼️ Dynamic image embedding with `[image:filename]` syntax
- 🔗 Project cross-linking with `[website_link:Project Name]` syntax
- 🎠 Automatic image carousel for unused images
- 📅 Accomplishments timeline with year sorting
- 👤 Dynamic About Me page with skills visualization
- 📱 Fully responsive design
- ⚡ Fast and lightweight
- 🎯 Easy to use - just add folders and text files!

## Installation

1. Clone or download this repository

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Starting the Website

Run the Flask application:

```bash
python app.py
```

Then open your browser to: `http://localhost:5000`

### Adding Projects

1. **Create a project folder**:
   - Navigate to the `projects` directory
   - Create a new folder with your project name (e.g., "My Awesome Project")

2. **Add description**:
   - Inside your project folder, create a `.txt` file (any name works)
   - Write your project description in plain text

3. **Add images**:
   - Create an `images` subfolder inside your project folder
   - Add your image files (PNG, JPG, GIF, WebP, SVG supported)

4. **Add hoverable images**:
   - Use the syntax `[image:filename.png:hover text]` to create hoverable image links
   - Example: `[image:screenshot.png:View Screenshot]`
   - When you hover the text, the image appears in a preview

5. **Image titles** (optional):
   - Create `images/image_titles.txt` to add custom titles
   - Format: `filename.png: Custom Title Here`
   - If not provided, filename is used as title (formatted nicely)

### Example Project Structure

```txt
projects/
├── My First Project/
│   ├── description.txt
│   └── images/
│       ├── image_titles.txt    ← Optional: custom image titles
│       ├── logo.png
│       ├── screenshot1.png
│       └── screenshot2.png
└── Another Project/
    ├── info.txt
    └── images/
        └── demo.jpg
```

### Image Titles & Descriptions (Optional)

Create `images/image_titles.txt` to give custom titles and descriptions to your images:

```txt
screenshot1.png: Main Interface Design | Clean and modern UI
screenshot2.png: Dashboard Overview | Analytics and data visualization
logo.png: Company Logo | Brand identity design
```

**Format**: `filename: Title | Description`

- Title appears below the thumbnail
- Description appears in a tooltip on hover
- Description is optional (omit `| Description` if not needed)
- If file not provided, system auto-formats filename as title

### Example Text File

```txt
Welcome to My Project!

This is the introduction to my project.

Hover to see the main interface: [image:screenshot1.png:View Main Interface]

You can add more text and hoverable images as needed.

Check out the dashboard design: [image:screenshot2.png:Dashboard Preview]

All images appear in the gallery at the top. Click any thumbnail to view full-size!
```

### Linking Between Pages

You can link to other projects from your text files using:

```txt
Check out [website_link:My First Project] for more details!
```

This works in:

- ✅ Project descriptions
- ✅ Accomplishment descriptions
- ✅ About page sections

## Accomplishments Timeline

Add your achievements to the `accomplishments/` folder:

1. Create folders with format: `YYYY - Achievement Name`
2. Add a `.txt` file with description
3. (Optional) Add `images/` folder
4. Multiple accomplishments per year are supported!

Example:

```txt
accomplishments/
├── 2025 - Launched Portfolio/
├── 2025 - Won Hackathon/
└── 2024 - Started Coding/
```

Visit `/timeline` to see your accomplishments!

## About Me Page

Create an `about/` folder with:

1. **Multiple .txt files** - Each becomes a section
   - Filename becomes the title (uppercase, _ replaced with spaces)
   - Example: `my_background.txt` → "MY BACKGROUND"

2. **skills.csv** (optional) - Visual skills chart

   ```csv
   name,max,min,score,label,year
   Python,100,0,85,Advanced,2023
   JavaScript,100,0,75,Proficient,2024
   ```

The page will display:

- All your text sections with purple styling
- Animated skill bars showing proficiency levels
- Year you started each skill (optional)

Visit `/about` to see your about page!

## Customization

### Changing Colors

Edit `static/style.css` and modify the CSS variables in the `:root` section:

```css
:root {
    --bg-primary: #0a0a0f;
    --bg-secondary: #151520;
    --purple-primary: #8b5cf6;
    --purple-secondary: #a78bfa;
    /* ... more colors */
}
```

### Changing the Site Title

Edit `templates/base.html` and modify the logo text:

```html
<a href="/" class="logo">Your Name</a>
```

### Changing Port

In `app.py`, modify the port number:

```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change 5000 to your preferred port
```

## Features Explained

### Dynamic Project Loading

- Projects are automatically discovered from the `projects` folder
- No need to edit code or config files
- Just add a folder and refresh!

### Image Embedding

- Use `[image:filename]` anywhere in your text
- Images are displayed inline with beautiful styling
- Supports relative paths within the project's images folder

### Image Carousel

- Unused images automatically appear in a carousel
- Navigate with arrow buttons or keyboard
- Click indicator dots to jump to specific images
- Smooth transitions and animations

### Responsive Design

- Looks great on desktop, tablet, and mobile
- Touch-friendly navigation
- Optimized for all screen sizes

## Tips

- Use descriptive folder names - they become your project titles
- Organize images in the `images` subfolder
- You can have multiple text files per project (they'll be combined)
- Image formats supported: PNG, JPG, JPEG, GIF, WebP, SVG
- Use blank lines in your text file to create new paragraphs

## Troubleshooting

**Projects not showing?**

- Make sure your project folder is directly in the `projects` directory
- Check that you have at least one `.txt` file in the folder

**Images not displaying?**

- Verify the image is in the `images` subfolder
- Check the filename spelling and extension
- Make sure the image format is supported

**Port already in use?**

- Change the port in `app.py` or stop the application using that port

## License

Free to use and modify for your own portfolio!

## Credits

Built with Flask, HTML, CSS, and JavaScript. Icons by Font Awesome.

---

Enjoy building your portfolio! 🚀
