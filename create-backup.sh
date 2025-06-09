#!/bin/bash

echo "Creating GitHub backup for Personality AI..."

# Create backup directory
mkdir -p backup-files

# Copy essential files
cp -r client/ backup-files/
cp -r server/ backup-files/
cp -r shared/ backup-files/
cp -r docs/ backup-files/
cp -r public/ backup-files/

# Copy config files
cp package.json backup-files/
cp *.md backup-files/
cp .gitignore backup-files/
cp *.sh backup-files/
cp *.ts backup-files/ 2>/dev/null || true
cp *.js backup-files/ 2>/dev/null || true

# Create archive
cd backup-files
tar -czf ../personality-ai-github-backup.tar.gz .
cd ..

# Cleanup
rm -rf backup-files

echo "Backup created: personality-ai-github-backup.tar.gz"
echo "Download this file and extract it on your local machine"
echo "Then run: ./backup-to-github.sh"