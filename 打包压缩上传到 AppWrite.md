修改之后先打包, 否则上传的不是最新版本

npm run build

tar -czvf release.tar.gz -C dist/public assets index.html

会生成一个文件到项目根目录, 通过 AppWrite Site 部署即可.
