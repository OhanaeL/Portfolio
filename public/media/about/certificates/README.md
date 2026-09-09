# Certificates Folder

Add your certificate files and metadata here.

## Supported Formats
- PDF (`.pdf`)
- Images (`.jpg`, `.jpeg`, `.png`)

## How to Add Certificates

### 1. Add Certificate Files
Place your certificate files in this folder:
```
certificates/
  python_certification.pdf
  web_development.pdf
  aws_cloud.png
```

### 2. Add Metadata in `certificates.txt`

Create or edit `certificates.txt` to add metadata for each certificate:

```
filename: python_certification.pdf
title: Python Programming Certificate
description: Advanced Python programming course covering data structures and algorithms
year: 2024
verification: https://verify.example.com/cert123

filename: web_development.pdf
title: Full Stack Web Development
description: Complete web development bootcamp
year: 2023
verification: https://verify.example.com/cert456
```

**Fields:**
- `filename` (required): The exact filename of the certificate
- `title` (required): Display title for the certificate
- `description` (optional): Brief description of what the certificate is for
- `year` (optional): Year obtained
- `verification` (optional): URL to verify the certificate (e.g., Credly, Coursera, etc.)

**Note:** Leave a blank line between each certificate entry.

### 3. Display

Each certificate will be shown as a card with:
- 🏆 Certificate icon
- Title and year badge
- Description
- "View Certificate" button (opens the file)
- "Verify" button (if verification URL provided)

Certificates appear on your About Me page based on the order specified in `about/order.txt`.

## Ordering

To control where certificates appear on your About Me page:

1. Edit `about/order.txt`
2. Add `certificates` to the desired position

Example:
```
introduction
skills
certificates
philosophy
my_background
```

This will show: Introduction → Skills → Certificates → Philosophy → Background

