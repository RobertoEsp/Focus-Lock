const fs = require('fs');
const path = require('path');

// Files and directories to include in the distribution
const filesToInclude = [
  'manifest.json',
  'background.js',
  'privacy-policy.html'
];

const directoriesToInclude = [
  'icons',
  'popup'
];

// Files to exclude from directories
const excludeFiles = [
  '.DS_Store',
  'generate-icons.html',
  '.git',
  '.gitignore',
  'build.js',
  'publish-todo.md',
  'store-listing.md'
];

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`✓ Copied: ${src} -> ${dest}`);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    // Skip excluded files
    if (excludeFiles.includes(item)) {
      console.log(`⚠ Skipped: ${srcPath} (excluded)`);
      continue;
    }
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function build() {
  const sourceDir = path.join(__dirname, 'src');
  const distDir = path.join(__dirname, 'dist');
  
  console.log('🚀 Building Firefox extension distribution...\n');
  
  // Clean dist directory
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('🗑️  Cleaned existing dist directory');
  }
  
  // Create dist directory
  fs.mkdirSync(distDir);
  console.log('📁 Created dist directory\n');
  
  // Copy individual files
  for (const file of filesToInclude) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
      copyFile(srcPath, destPath);
    } else {
      console.log(`❌ Error: ${file} not found`);
    }
  }
  
  console.log('');
  
  // Copy directories
  for (const dir of directoriesToInclude) {
    const srcPath = path.join(sourceDir, dir);
    const destPath = path.join(distDir, dir);
    
    if (fs.existsSync(srcPath)) {
      console.log(`📁 Copying directory: ${dir}`);
      copyDirectory(srcPath, destPath);
      console.log(`✓ Completed: ${dir}\n`);
    } else {
      console.log(`❌ Error: ${dir} directory not found`);
    }
  }
  
  // Create a summary of what was built
  const summary = {
    buildTime: new Date().toISOString(),
    files: [],
    directories: []
  };
  
  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativeItemPath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        summary.directories.push(relativeItemPath);
        scanDirectory(fullPath, relativeItemPath);
      } else {
        summary.files.push(relativeItemPath);
      }
    }
  }
  
  scanDirectory(distDir);
  
  console.log('📊 Build Summary:');
  console.log(`   Files: ${summary.files.length}`);
  console.log(`   Directories: ${summary.directories.length}`);
  console.log(`   Build time: ${summary.buildTime}`);
  console.log('\n✅ Build completed successfully!');
  console.log(`📦 Distribution ready in: ${distDir}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Zip the dist folder');
  console.log('   2. Upload to Firefox Add-ons');
}

// Run the build
build(); 