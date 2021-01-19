//implement pack files based on demands
//pack based on all imports, use babel-plugin-import
const {override, overrideDevServer, fixBabelImports, addLessLoader} = require('customize-cra');

// 跨域配置
const devServerConfig = () => config => {
    return {
        ...config,
        // 服务开启gzip
        compress: true,
        proxy: {
            '/api': {
                target: 'xxx',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api',
                },
            }
        }
    }
};

module.exports = {
    webpack: override(
        fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true, //automatically pack related css
        }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: {'@primary-color': '#1DA57A'},
        }),
    ),
    devServer: overrideDevServer(
        devServerConfig()
    )
};
