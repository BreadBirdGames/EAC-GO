libDir = lib
buildDir = bin

assetsDir = assets
srcFiles = index.html index.css index.js

copyLibs:
	cp -r $(libDir)/* $(buildDir)

copyAssets:
	mkdir -p $(buildDir)/assets
	cp $(assetsDir)/* $(buildDir)/assets

$(buildDir):
	mkdir -p $(buildDir)

build: $(buildDir) copyLibs copyAssets
	for file in $(srcFiles) ; do \
		minify $$file > $(buildDir)/$$file ; \
	done