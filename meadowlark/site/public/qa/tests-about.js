suite('关于页面测试', function(){
    test('page should contain link to contact page', function(){
        assert($('a[href="/contact"]').length);
    });
});