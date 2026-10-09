# 生产与部署

使用 ofa.js 开发的项目，直接部署到静态服务器上即可使用。

## 开发环境

你可以使用官方的 [ofa Studio](https://core.noneos.com/?redirect=studio) 进行开发，它提供了一键式的项目创建和预览。

你还可以自建静态服务器：

* 使用 Nginx 或 Apache 等静态服务器软件
* 使用 Node.js 的 [http-server](https://www.npmjs.com/package/http-server) 模块
* 直接使用编辑器的静态服务器插件来预览

## 生产环境

### 导出项目

如果你使用的是 [ofa Studio](https://core.noneos.com/?redirect=studio) 构建的项目，直接使用工具自带的导出功能即可。

如果是手动构建的项目，你可以直接将项目文件夹部署到静态服务器上即可，保持和开发环境的模式一致。

### 压缩混淆

生产环境通常需要使用压缩混淆工具来减小文件体积，提高加载速度。你可以使用 [Terser CLI](https://terser.org/docs/cli-usage/) 进行压缩混淆。

如果你不想使用命令行工具，可以使用 [ofa build](https://builder.ofajs.com/) 在线进行文件压缩混淆。该工具目前为测试版，后期会合并到 ofa Studio 中。

