# 莱莎摄影工作室 选片系统

### 配置
1. 将照片文件夹用NGINX代理到img.xxx.com
2. 上传照片文件夹
```
rsync -anv ./ --exclude=.DS_Store ls@xxx.com:/home/ls/img

rsync -azP ./ --exclude=.DS_Store ls@xxx.com:/home/ls/img
```
3. 将`index.js`中的`IMG_PATH`设置为1中的照片文件夹的物理路径
4. 添加一个`config.json`中的配置节点，其中`code`是选片码，`folder`是2中上传的文件夹名，`size`是选片数量
