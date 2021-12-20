# getfile

## install

npm install getfile -g

为下载或上传文件创建一个临时的服务程序,在传输完成后服务自动退出.

下载采用GET方式,上传采用PUT方式.

服务路径临时创建,端口和访问路径为随机数,其中端口大于4000

## useage

```
Usage: getfile [options]                                        
                                                              
Options:                                                      
                                                              
  -V, --version  output the version number                    
  -h, --help     show help                                    
  -i, --ip       IP Address                                   
  -p, --port     set PORT, set port, default with random port 
  -z, --gzip     set ZIP, download with zipped                
  -u, --upload   PUT file NOT GET file, upload not download   
```

### 上传文件:

开启服务: getfile -u xxxx.zip

```
> getfile -u xxx.zip
Server running at http://192.168.1.116:4131/92087
```

创建一个临时服务,上传文件后文件命名为xxxx.zip保存在当前目录下.

上传举例: curl -T samefile.zip  http://192.168.1.2:4131/92087

这里的服务上传路径是启动服务后输出的.

### 下载文件:

开启服务: getfile xxxx.zip

```
> getfile xxx.zip
Server running at http://192.168.1.116:4565/137797/xxxx.zip
```

创建一个临时服务,可通过GET方式访问得到对应的文件.

下载举例: wget http://192.168.1.116:4565/137797 或者 http://192.168.1.116:4565/137797/xxxx.zip