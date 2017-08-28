/**
 * 定义系统的常量
 */
// 'http://testwww.iyanshu.cn/mobile/';//二级分销H5开发环境
const H5_HOST = 'http://www.iyanshu.cn/mobile/';//二级分销生产环境

export const config = {
  //版本号
  VERSION: '1.2.0',
  //版本发布时间
  ANDROID_RELEASE_TIME: 1476798884845,
  IOS_RELEASE_TIME: 1476798884845,

  HOST: 'http://api.xuezheyoushi.com/',//生产环境
  //   HOST: 'http://192.168.0.88:28088',//开发环境
//用于跳转项目的快商通客服页
  PC_DOMAIN: 'http://www.iyanshu.cn/',
  //网络超时
  HTTP_TIME_OUT: 2,
  IMAGE_LIST_SIZE: 160,
  RETURN_GOODS_PROOF_SIZE: 56,
  SUPPORT_IMAGE_SEARCH: true,
  PAY_MODES: [4, 1,2], //在线支付方式, 至少需要配置一项; 1:支付宝; 2: 微信支付; 3:银联; 4:预存款
  UNIONPAY_MODE: '1', // 0 - 启动银联正式环境; 1 - 连接银联测试环境;
  // SUPPORTS: '由千米商城提供技术支持'


  //------------------webUrls---------------------------
  //个人中心- 邀請好友
  inviteFriends:H5_HOST+'getInvitationCode.htm?appCode=',
  //个人中心-我的獎勵
  myPrize:H5_HOST+'getMyCommission.htm?appCode=',
  //个人中心-我的好友
  myFriends:H5_HOST+'myFriend.htm?appCode=',

  //二级分销-邀请好友-分享链接
  promotionShareUrl:H5_HOST+'weixinAfter.htm?from=singlemessage&invitationCode=',
  //分享图标
  iconUrl:H5_HOST+'images/yysimg.jpg',

  //世界邦地址
  worldBang :'http://m.shijiebang.com/?sr=gp_4235293256',




};



export default config;
