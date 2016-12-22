suite('全局测试', function(){
    test('page has a valid title', function(){
        assert(document.title && document.title.match(/\S/) &&
        document.title.toUpperCase() !== 'TODO');
        //修改main.handlebars的titel为TODO刷浏览器
    });
});