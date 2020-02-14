<template>
    <div class="container">
        <table>
            <tr class="header">
                <td :colspan="12">
                    <div class="header-logo">
                        <img src="https://oss.yuansfer.com/images/marketing/logo-4.png?x-oss-process=image/resize,h_30"
                             alt="logo icon">
                    </div>
                </td>
                <td :colspan="12">
                    <div class="cur-language">
                        <van-button @click="changeLanguage" class="lang-btn">{{GLOBAL.LANG_DESC[curLan]}}</van-button>
                    </div>
                </td>
            </tr>
            <tr>
                <td :colspan="24" class="mer-bg blue">
                    <div class="merchant">
                        <div class="logo">
                            <img :src="curMechant.merLogo" alt="merchant logo"/>
                        </div>
                        <div class="store-info">
                            <p>{{curMechant.storeName}}</p>
                            <p>{{curMechant.merchantName}}</p>
                            <p>{{curMechant.address}}</p>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td :colspan="24">
                    <div class="amount-fee">
                        <van-cell-group>
                            <van-field :label="$t('formlabel.costAmount')+'('+curCurrency+')'"
                                       input-align="right"
                                       :clearable="true"
                                       v-model="formdata.costAmount" />
                            <van-field :label="$t('formlabel.ConvenienceFee')+'('+paymentRate.convenientFeePercent+'%)'"
                                       :readonly="true"
                                       input-align="right"
                                       v-model="formdata.ConvenienceFee" />
                            <van-field :label="$t('formlabel.svc')+'('+paymentRate.svcPercent+'%)'"
                                       :readonly="true"
                                       input-align="right"
                                       v-model="formdata.svc" />
                            <van-field :label="$t('formlabel.tax')+'('+paymentRate.taxPercent+'%)'"
                                       :readonly="true"
                                       input-align="right"
                                       v-model="formdata.tax" />
                        </van-cell-group>
                        <!--自定义税费-->
                        <div v-if="paymentRate.storeCustomtaxes && paymentRate.storeCustomtaxes.length>0">
                            <van-field v-for="(item,index) in paymentRate.storeCustomtaxes" :key="index"
                                      :label="item.taxName+'('+item.taxValue+'%)'"
                                      :readonly="true"
                                       input-align="right"
                                      v-model="Customtaxes[index]" />
                        </div>
                        <div class="cal-total-amount">
                            <van-field :label="$t('formlabel.totalAmount')+'('+curCurrency+')'"
                                       :readonly="true"
                                       input-align="right"
                                       v-model="formdata.totalAmount" />
                        </div>
                        <p>
                            {{$t('message.approx')}}
                            <span class="single-word">{{currency}}：</span>
                            <span class="cal-total-amount">{{calTotalAmount}}</span>
                        </p>
                    </div>
                </td>
            </tr>
            <tr>
                <td :colspan="24">
                    <div class="title-label">
                        <label>{{$t('message.paymentMethod')}}</label>
                    </div>
                    <van-radio-group v-model="curVentor">
                        <van-cell-group>
                            <van-cell :clickable="false" @click="selectVentor('wechatpay')">
                                <div slot="title">
                                    <img :src="wechatpayUrl" alt="wechatpay"
                                         :class="{'unactive': !(curMechant.supportVentor && curMechant.supportVentor.indexOf('wechatpay')>-1)}"/>
                                </div>
                                <van-radio slot="right-icon"
                                           v-if="curMechant.supportVentor && curMechant.supportVentor.indexOf('wechatpay')>-1"
                                           name="wechatpay" />
                            </van-cell>
                            <van-cell :clickable="false" @click="selectVentor('alipay')">
                                <div slot="title">
                                    <img :src="alipayUrl" alt="alipay"
                                         :class="{'unactive': !(curMechant.supportVentor && curMechant.supportVentor.indexOf('alipay')>-1)}"/>
                                </div>
                                <van-radio slot="right-icon"
                                           v-if="curMechant.supportVentor && curMechant.supportVentor.indexOf('alipay')>-1"
                                           name="alipay" />
                            </van-cell>
                            <van-cell clickable @click="selectVentor('unionpay')">
                                <div slot="title">
                                    <img :src="unionpayUrl" alt="unionpay"
                                         :class="{'unactive': !(curMechant.supportVentor && curMechant.supportVentor.indexOf('unionpay')>-1)}"/>
                                </div>
                                <van-radio slot="right-icon"
                                           v-if="curMechant.supportVentor && curMechant.supportVentor.indexOf('unionpay')>-1"
                                           name="unionpay" />
                            </van-cell>
                            <!--信用卡支付：开通了且是美元结算才会显示-->
                            <van-cell clickable
                                      v-if="curMechant.supportVentor && curMechant.supportVentor.indexOf('creditpay')>-1 && curCurrency==='USD'"
                                      @click="selectVentor('creditpay')">
                                <div slot="title">
                                    <img :src="creditcardUrl" alt="creditpay"
                                         :class="{'unactive': !(curMechant.supportVentor && curMechant.supportVentor.indexOf('creditpay')>-1)}"/>
                                </div>
                                <van-radio slot="right-icon"
                                           name="creditpay" />
                            </van-cell>
                        </van-cell-group>
                    </van-radio-group>
                </td>
            </tr>
            <tr>
                <td :colspan="24">
                    <div class="title-label">
                        <label>{{$t('message.payerInfo')}}</label>
                    </div>
                    <van-cell-group class="payer-info">
                        <van-field v-model.trim="formdata.name"
                                   :placeholder="$t('placeholder.name')"
                                   input-align="right"
                                   clearable
                                   :label="$t('formlabel.name')"/>
                        <van-field v-model.trim="formdata.phone"
                                   :placeholder="$t('placeholder.phone')"
                                   input-align="right"
                                   clearable
                                   :label="$t('formlabel.phone')"/>
                        <van-field v-model.trim="formdata.email"
                                   :placeholder="$t('placeholder.email')"
                                   input-align="right"
                                   type="email"
                                   :error-message="errorEmail"
                                   error-message-align="right"
                                   clearable
                                   :label="$t('formlabel.email')"/>
                        <van-field v-model.trim="formdata.note"
                                   rows="1"
                                   autosize
                                   type="textarea"
                                   maxlength="30"
                                   :placeholder="$t('placeholder.note')"
                                   input-align="right"
                                   clearable
                                   :label="$t('formlabel.note')"
                                   show-word-limit/>
                        <!--<van-field>-->
                            <!--<div slot="input"></div>-->
                        <!--</van-field>-->
                    </van-cell-group>
                </td>
            </tr>
            <tr>
                <td :colspan="24">
                    <div class="btn-fullimg" @click="handleImgDia">{{$t('message.tranLimitRef')}}
                        <img style="width: 12px"
                             src="https://oss.yuansfer.com/ticket/20200117/fc8c2f7bb6ed2c6e8d1d32e6fe9e90ae.png" alt="">
                    </div>
                    <div>
                        <van-button @click="pay" type="info" block>{{$t('message.payment')}}</van-button>
                    </div>
                </td>
            </tr>
        </table>
        <div>
            <van-dialog
                v-model="showDialog"
                width="100%"
                :lock-scroll="false"
                :title="$t('message.tranLimitRef')">
                <div class="img-dialog">
                    <img src="https://oss.yuansfer.com/material/payment-channel-docs/transaction-limits.png">
                    <van-button @click="handleImgDia"
                                icon="arrow-left">
                    </van-button>
                </div>
            </van-dialog>
        </div>
    </div>
</template>

<script>
export default {
 name: 'index',
 data () {
     // let checkAmount = (rule, value, callback) => {
     //     if (value === '') {
     //         callback(new Error('Please input positive integer!'))
     //     } else if (/^[0-9]{1,5}.[0-9]{0,2}$/.test(value)) {
     //         callback(new Error('Please input positive integer!'))
     //         } else {
     //         callback()
     //     }
     // }
     return {
         // GLOBAL: this.GLOBAL.LANGUAGE,
         errorEmail: '',
         showDialog: false,
         curLan: true,
         curVentor: null, // 当前选中的支付渠道
         qrcodeDesc: '手机打开请扫描二维码',
         curMechant: { // 商户信息
             qrcodeUrl: 'https://oss.yuansfer.com/images/yuansferme/yuansferme_1560871617907.jpg',
             merLogo: 'https://oss.yuansfer.com/logo-invoice.png?x-oss-process=image/resize,h_80',
             storeName: 'test0914Store',
             merchantName: 'testMerchant',
             address: 'Arizona 13123 wfwefwe',
             supportVentor: 'alipay,unionpay,creditpay'
         },
         rate: 6.912,
         calTotalAmount: '', // 转换后的总额
         curCurrency: 'USD', // 当前币种
         currency: 'CNY', // 转换币种
         paymentRate: { // 后端传过来
             convenientFeePercent: '2.32',
             svcPercent: '1.02',
             taxPercent: '2.34',
             storeCustomtaxes: [
                 // {taxName: 'tax1', taxValue: '4.56'},
                 {taxName: 'tax2', taxValue: '2.34'}
             ]
         },
         Customtaxes: {},
         formdata: { // 表单
             name: '',
             phone: '',
             email: '',
             note: '',
             costAmount: '',
             ConvenienceFee: '',
             svc: '',
             tax: '',
             // othersTaxes: '',
             othersTaxes: '',
             totalAmount: ''
         },
         alipayUrl: 'https://oss.yuansfer.com/images/marketing/aliPay.png',
         wechatpayUrl: 'https://oss.yuansfer.com/images/marketing/wePay.png',
         unionpayUrl: 'https://oss.yuansfer.com/images/marketing/UnionPay.png',
         creditcardUrl: 'https://oss.yuansfer.com/images/marketing/creditCardPay.png'
     }
 },
 watch: {
     'formdata.costAmount': {
         handler: function (curVal, oldVal) {
             if (curVal) {
                 // 限制输入为小于100000的正数
                 // 大于1
                 let isMoreThan = (/^[1-9]{1}[0-9]{0,5}\.{0,1}[0-9]{0,2}$/.test(curVal)) && (Number(curVal) <= this.GLOBAL.LIMIT_AMOUNT)
                 // 小于1
                 let isLessThan = (/^[0]{1}\.{0,1}[0-9]{0,2}$/.test(curVal)) && Number(curVal) >= 0
                 if (isMoreThan || isLessThan) {
                     this.setFee(curVal)
                     // totalAmount
                     this.setTotalAmount()
                     // calTotalAmount
                     this.setCalTotalAmount()
                 } else {
                     if (oldVal) { // 保留最后的正确输入
                         this.formdata.costAmount = oldVal
                     } else {
                         this.formdata.costAmount = ''
                         this.clearFee()
                     }
                     this.alertMsg('Please input a positive number < ' + String(this.GLOBAL.LIMIT_AMOUNT))
                 }
             } else {
                 this.alertMsg('Please input a positive number < ' + String(this.GLOBAL.LIMIT_AMOUNT))
                 this.clearFee()
             }
         }
     },
     'formdata.email': {
         handler: function (curVal, oldVal) {
             let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
             if (curVal && curVal.search(reg) === -1) {
                 this.errorEmail = 'ERROR！Email format'
             } else {
                 this.errorEmail = ''
             }
         }
     }
 },
 mounted: function () {
     this.initCustomtaxes()
 },
 methods: {
     initCustomtaxes: function () {
         if (this.paymentRate.storeCustomtaxes && this.paymentRate.storeCustomtaxes.length > 0) {
             for (let i = 0; i < this.paymentRate.storeCustomtaxes.length; i++) {
                 this.Customtaxes[i] = ''
             }
         }
     },
     changeLanguage: function () {
         this.curLan = !this.curLan
         let curLang = this.GLOBAL.LANG[!this.curLan]
         this.$i18n.locale = curLang
     },
     selectVentor: function (val) {
         if (this.curMechant.supportVentor && this.curMechant.supportVentor.indexOf(val) > -1) {
             this.curVentor = val
             alert(this.curVentor)
         }
     },
     checkFields: function () {
         // 检查必填字段
     },
     alertMsg: function (val) {
         let msg = null
         // ventor的提示
         let supportVentor = ['alipay', 'wechatpay', 'unionpay', 'creditpay']
         if (supportVentor.indexOf(val) > -1) {
             msg = '商户尚未开通' + val + '功能，请联系您的客户经理。'
         } else {
             msg = val
         }
         this.$toast({
             // showClose: true,
             className: 'toast',
             forbidClick: true,
             // type: 'fail',
             duration: 3000,
             message: msg
             // icon: iconName
         })
     },
     setFee: function (costAmount) {
         // 银行家算法 四舍六入五成双
         // ConvenienceFee
         if (this.paymentRate.convenientFeePercent) {
             this.formdata.ConvenienceFee = (Number(costAmount) * Number(this.paymentRate.convenientFeePercent) * 0.01).toFixed(2)
         } else {
             this.formdata.ConvenienceFee = ''
         }
         // svc
         if (this.paymentRate.svcPercent) {
             this.formdata.svc = (Number(costAmount) * Number(this.paymentRate.svcPercent) * 0.01).toFixed(2)
         } else {
             this.formdata.svc = ''
         }
         // tax
         if (this.paymentRate.taxPercent) {
             this.formdata.tax = (Number(costAmount) * Number(this.paymentRate.taxPercent) * 0.01).toFixed(2)
         } else {
             this.formdata.tax = ''
         }
         // otherTaxes
         this.setOtherTaxes(costAmount)
     },
     setOtherTaxes: function (costAmount) {
         // 计算otherTaxes
         let tmp = null
         if (this.paymentRate.storeCustomtaxes && this.paymentRate.storeCustomtaxes.length > 0) {
             for (let i = 0; i < this.paymentRate.storeCustomtaxes.length; i++) {
                 this.Customtaxes[i] = (Number(costAmount) * Number(this.paymentRate.storeCustomtaxes[i].taxValue) * 0.01).toFixed(2)
             }
             for (let j in this.Customtaxes) {
                 tmp += Number(this.Customtaxes[j])
             }
         }
         this.formdata.othersTaxes = tmp
         if (this.formdata.othersTaxes) {
             this.formdata.othersTaxes = this.formdata.othersTaxes.toFixed(2)
         }
     },
     setTotalAmount: function () {
         // 计算总额
         let keys = ['costAmount', 'ConvenienceFee', 'svc', 'tax', 'othersTaxes']
         let tmp = null
         for (let k of keys) {
             if (this.formdata[k]) {
                 tmp += Number(this.formdata[k])
             }
         }
         this.formdata.totalAmount = tmp
         if (this.formdata.totalAmount) {
             this.formdata.totalAmount = this.formdata.totalAmount.toFixed(2)
         }
     },
     setCalTotalAmount: function () {
         // 币种转换
         switch (this.curCurrency) {
             case 'USD': // USD2CNY
                 if (this.formdata.totalAmount && this.rate) {
                     this.calTotalAmount = (Number(this.formdata.totalAmount) * this.rate).toFixed(2)
                 }
                 break
             case 'CNY': // CNY2USD
                 if (this.formdata.totalAmount && this.rate) {
                     this.calTotalAmount = (Number(this.formdata.totalAmount) / this.rate).toFixed(2)
                 }
                 break
             default:
                 this.calTotalAmount = ''
         }
     },
     clearFee: function () {
         let keys = ['ConvenienceFee', 'svc', 'tax', 'othersTaxes', 'totalAmount']
         for (let i of keys) {
             this.formdata[i] = ''
         }
         // 清除Customtaxes
         this.Customtaxes = {}
         // 清除币种兑换值
         this.calTotalAmount = ''
     },
     handleImgDia: function () {
         // 建议限额图片
         this.showDialog = !this.showDialog
     },
     pay: function () { // 有线上线下两种接口
         alert(33)
     }
 }
}
</script>

<style scoped lang="less">
    .container {
     /*width: 100%;*/
     table{
         border-spacing: 0;
         width: 100%;
         padding: 5px 0 15px 0;
         label{
             padding: 0 16px;
             color: #323233;
             font-size: 16px;
         }
         .unactive{
             -webkit-filter: grayscale(100%);
             -moz-filter: grayscale(100%);
             /*-ms-filter: grayscale(100%);*/
             -o-filter: grayscale(100%);
             filter: grayscale(100%);
             /*filter: gray;*/
         }
         .header {
             background-color: #ffffff;
             padding: 0;
             .header-logo{
             }
             .cur-language{
                 text-align: right;
                 padding-right: 2px;
                 .lang-btn{
                     background-color:#2F4051;
                     color:#fff;
                     border-style:none;
                     width: 80px;
                 }
             }
         }
         .mer-bg{
             box-sizing:border-box;
             width:100%;
             position:relative;
             max-height:300px;
             overflow:hidden;
             background:linear-gradient(180deg,#58b4d3 0,#695fb5 100%);
             background:-o-linear-gradient(-90deg,#58b4d3 0,#695fb5 100%);
             text-shadow:0 0 2px rgba(0,0,0,.4);
             padding:15px;
         }
         .blue{
             background:linear-gradient(180deg,#58b4d3 0,#695fb5 245px);
             background:-o-linear-gradient(-90deg,#58b4d3 0,#695fb5 245px)
         }
         .merchant{
             width: 100%;
             text-align: -webkit-center;
             .logo{
                 width: 60px;
                 height: 60px;
                 border-radius: 60px;
                 background-color: transparent;
                 box-shadow: 0 5px 12px 0 rgba(2,2,2,.3);
                 vertical-align: middle;
                 display: table-cell;
                 text-align: center;
                 img{
                     width: 85%;
                 }
             }
             .store-info{
                 padding: 5px;
                 p{
                     color: #fff;
                     padding: 0;
                     margin: 0;
                     font-size: 12px;
                 }
                 p:first-child{
                     font-size: 18px;
                 }
             }
         }
         .amount-fee /deep/ .van-field__label {
             -webkit-box-flex: 0;
             -webkit-flex: none;
             flex: none;
             width: 180px;
         }
         .amount-fee{
             p{
                 text-align: right;
                 margin: 0;
                 padding: 0 10px 10px 0;
                 background-color: #fff;
                 .cal-total-amount{
                     color: #ff8208;
                     font-weight: bold;
                 }
                 .single-word{
                     padding: 0 5px;
                 }
             }
         }
         .cal-total-amount /deep/ .van-field__control:read-only {
             color: #ff8208;
             font-weight: bold;
             font-size: 16px;
         }
         .title-label{
             margin: 16px 0;
         }
         .btn-fullimg {
             margin: 10px 0 16px 16px;
             font-size: 12px;
             color: #A2A2A2;
         }
         .payer-info /deep/ .van-field__label {
             -webkit-box-flex: 0;
             -webkit-flex: none;
             flex: none;
             width: 70px;
         }
     }
     .img-dialog{
         height: 100vh;
         overflow-y: auto;
         margin-top: 60px;
         img{
             width: 100%;
         }
     }
     .toast{}
}
</style>
