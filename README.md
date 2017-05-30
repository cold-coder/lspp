# 莱莎摄影工作室 选片系统

### 部署与配置

1. 将照片文件夹用NGINX代理到img.yourdomain.com
```
server {
         listen 80;
         server_name img.yourdomain.com;
         root /home/yaocheng/img;

         location / {
                 try_files $uri $uri/ =404;
         }
 }
```

2. 将`config.js`中的`imagePath`设置为1中的照片文件夹的物理路径
```
'imagePath': '/home/yaocheng/img/',
```

4. 用NGINX代理pp_server的服务地址
```
server {
         listen 80;
         server_name pp.yourdomain.com;
         location / {
                 proxy_pass http://localhost:9001;
         }
 }
```

6. 重启NGINX
```
$sudo nginx  -s reload
```

5. 将`web/js/config.js`中的`global.API_URL`设置为4中的代理地址，`global.IMG_DOMAIN`设置为1中的地址
```
global.API_URL = 'pp.yourdomain.com'
```

6. 启动MongoDB
```
mongod
```

7. 启动pp_server
```
$pm2 start pp_server
```


### 使用说明

1. 压缩文件夹中的照片
```
$sips -Z 800 *.jpg
```

2. 上传照片
```
$rsync -anv ./ --exclude=.DS_Store youraccount@yourdomain.com:/home/youraccount/img/pet

$rsync -azP ./ --exclude=.DS_Store youraccount@yourdomain.com:/home/youraccount/img/pet
```

3. 添加一个`client.json`中的配置节点，其中`code`是选片码，`folder`是2中上传的文件夹名`pet`，`size`是选片数量
```
{
  "code": "yoyo",
  "folder": "pet",
  "size": "5"
}
```

4. 重启pp_server
```
$pm2 restart pp_server
```

5. 将用上面的code发给客户
