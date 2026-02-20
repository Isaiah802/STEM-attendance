"""
Build script to generate static HTML files for Firebase Hosting
This converts Flask templates with url_for() to static HTML with hardcoded paths
"""

import os
import shutil
from pathlib import Path

# Create public directory
public_dir = Path('public')
if public_dir.exists():
    shutil.rmtree(public_dir)
public_dir.mkdir()

# Copy static files
shutil.copytree('static', public_dir / 'static')
shutil.copy('404.html', public_dir / '404.html')

# Template files to convert
templates = {
    'index.html': 'index.html',
    'attendance.html': 'attendance.html',
    'about.html': 'about.html',
    'events.html': 'events.html',
    'projects.html': 'projects.html',
    'resources.html': 'resources.html',
    'gallery.html': 'gallery.html',
    'contact.html': 'contact.html',
    'faq.html': 'faq.html',
    'admin.html': 'admin.html',
    '404.html': '404.html'
}

def convert_flask_to_static(content):
    """Convert Flask template syntax to static paths"""
    # Replace url_for for static files (relative paths for Firebase Hosting)
    content = content.replace("{{ url_for('static', filename='css/styles.css') }}", "static/css/styles.css")
    content = content.replace("{{ url_for('static', filename='js/app.js') }}", "static/js/app.js")
    content = content.replace("{{ url_for('static', filename='js/firebase-config.js') }}", "static/js/firebase-config.js")
    content = content.replace("{{ url_for('static', filename='js/theme.js') }}", "static/js/theme.js")
    content = content.replace("{{ url_for('static', filename='js/admin.js') }}", "static/js/admin-secure.js")
    content = content.replace("{{ url_for('static', filename='js/attendance.js') }}", "static/js/attendance.js")
    
    # Replace url_for for routes
    content = content.replace("{{ url_for('index') }}", "index.html")
    content = content.replace("{{ url_for('attendance') }}", "attendance.html")
    content = content.replace("{{ url_for('about') }}", "about.html")
    content = content.replace("{{ url_for('events') }}", "events.html")
    content = content.replace("{{ url_for('projects') }}", "projects.html")
    content = content.replace("{{ url_for('resources') }}", "resources.html")
    content = content.replace("{{ url_for('gallery') }}", "gallery.html")
    content = content.replace("{{ url_for('contact') }}", "contact.html")
    content = content.replace("{{ url_for('faq') }}", "faq.html")
    content = content.replace("{{ url_for('admin') }}", "admin.html")
    
    # Fix hardcoded absolute paths to relative paths for Firebase Hosting
    content = content.replace('src="/static/', 'src="static/')
    content = content.replace('href="/static/', 'href="static/')
    content = content.replace('href="/index.html"', 'href="index.html"')
    content = content.replace('href="/attendance.html"', 'href="attendance.html"')
    content = content.replace('href="/about.html"', 'href="about.html"')
    content = content.replace('href="/events.html"', 'href="events.html"')
    content = content.replace('href="/projects.html"', 'href="projects.html"')
    content = content.replace('href="/resources.html"', 'href="resources.html"')
    content = content.replace('href="/gallery.html"', 'href="gallery.html"')
    content = content.replace('href="/contact.html"', 'href="contact.html"')
    content = content.replace('href="/faq.html"', 'href="faq.html"')
    content = content.replace('href="/admin.html"', 'href="admin.html"')
    
    return content

# Convert and copy templates
for src, dst in templates.items():
    src_path = Path('templates') / src
    dst_path = public_dir / dst
    
    if src_path.exists():
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert Flask syntax to static paths
        content = convert_flask_to_static(content)
        
        with open(dst_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'✓ Converted {src} -> public/{dst}')
    else:
        print(f'⚠ Skipping {src} (not found)')

print('\n✅ Build complete! Run "firebase deploy" to deploy.')
print('📁 Static files generated in public/ directory')
