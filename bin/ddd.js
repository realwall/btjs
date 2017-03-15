define('widget/is', [], function(require, exports, module) {

  /**
   * 内置类型验证规则
   * @type {Object}
   */
  var Rules = {
    email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    mobile: /^(1|9)\d{10}$/,
    qq: /^\d{5,16}$/,
    password: /[a-zA-Z\d`~!@#$%^&*()_\-+={}\[\]\\|:;"'<>,.?\/]{6,16}/,
    number: /^[0-9]+$/,
    amount: /^\d+(\.\d{1,2})?$/,
    name: /^[\u4E00-\u9FA5\·\u00B7]+$/
  };

  // 对外提供接口
  module.exports = Is;
});