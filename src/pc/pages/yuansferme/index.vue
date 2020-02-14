<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="12">
                    <div class="header-logo">
                        <img src="https://oss.yuansfer.com/images/marketing/logo-4.png?x-oss-process=image/resize,h_30"
                              alt="logo icon">
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="cur-language">
                        <el-button @click="changeLanguage">{{GLOBAL.LANG_DESC[curLan]}}</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row class="box-header blue">
                <el-col :span="3">
                    <div class="logo">
                        <img :src="curMechant.merLogo" alt="logo"/>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="merInfo">
                        <p>{{curMechant.storeName}}</p>
                        <p>{{curMechant.merchantName}}</p>
                        <p>{{curMechant.address}}</p>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="qrcode">
                        <img :src="curMechant.qrcodeUrl" alt="qrcode"/>
                        <p>{{$t('message.qrcodeDesc')}}</p>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form ref="formdata" :model="formdata" label-width="180px" :rules="rules">
                        <!--金额-->
                        <div class="strong-num">
                            <el-form-item prop="costAmount">
                                <div slot="label">
                                    {{$t('formlabel.costAmount')}}({{curCurrency}})
                                </div>
                                <el-input
                                    clearable
                                    class="strong-num"
                                    v-model.trim="formdata.costAmount">
                                </el-input>
                            </el-form-item>
                            <el-form-item v-if="paymentRate.convenientFeePercent">
                                <div slot="label">
                                    {{$t('formlabel.ConvenienceFee')}}({{paymentRate.convenientFeePercent}}%)
                                </div>
                                <el-input disabled class="strong-num" v-model="formdata.ConvenienceFee"></el-input>
                            </el-form-item>
                            <el-form-item v-if="paymentRate.svcPercent">
                                <div slot="label">
                                    {{$t('formlabel.svc')}}({{paymentRate.svcPercent}}%)
                                </div>
                                <el-input disabled class="strong-num" v-model="formdata.svc"></el-input>
                            </el-form-item>
                            <el-form-item v-if="paymentRate.taxPercent">
                                <div slot="label">
                                    {{$t('formlabel.tax')}}({{paymentRate.taxPercent}}%)
                                </div>
                                <el-input disabled class="strong-num" v-model="formdata.tax"></el-input>
                            </el-form-item>
                            <div v-if="paymentRate.storeCustomtaxes && paymentRate.storeCustomtaxes.length>0">
                                <el-form-item v-for="(item,index) in paymentRate.storeCustomtaxes" :key="index">
                                    <div slot="label">
                                        {{item.taxName}}({{item.taxValue}}%)
                                    </div>
                                    <el-input disabled v-model="Customtaxes[index]"></el-input>
                                </el-form-item>
                            </div>
                            <el-form-item>
                                <div slot="label">
                                    {{$t('formlabel.totalAmount')}}({{curCurrency}})
                                </div>
                                <el-input disabled class="strong-num" v-model="formdata.totalAmount"></el-input>
                                <span>{{$t('message.approx')}} <span class="single-word">{{currency}}：</span>
                                <span class="cal-total-amount">{{calTotalAmount}}</span>
                            </span>
                            </el-form-item>
                        </div>
                        <!--支付方式-->
                        <el-form-item>
                            <div slot="label">
                                {{$t('message.paymentMethod')}}
                            </div>
                            <el-row class="paymentMethod" :gutter="20">
                                <el-col :span="5">
                                    <!--已经支持的支付-->
                                    <div v-if="curMechant.supportVentor && curMechant.supportVentor.indexOf('alipay')>-1"
                                         :class="{'selected-ventor': curVentor=='alipay'}"
                                         @click="selectVentor('alipay')">
                                        <img :src="alipayUrl" alt="alipay"/>
                                    </div>
                                    <!--还没开通的支付-->
                                    <div v-else class="unactive" @click="alertMsg('alipay')">
                                        <img :src="alipayUrl" alt="alipay"/>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div v-if="curMechant.supportVentor && curMechant.supportVentor.indexOf('wechatpay')>-1"
                                        :class="{'selected-ventor': curVentor=='wechatpay'}" @click="selectVentor('wechatpay')">
                                        <img :src="wechatpayUrl" alt="wechatpay"/>
                                    </div>
                                    <div v-else class="unactive" @click="alertMsg('wechatpay')">
                                        <img :src="wechatpayUrl" alt="wechatpay"/>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div v-if="curMechant.supportVentor && curMechant.supportVentor.indexOf('unionpay')>-1"
                                         :class="{'selected-ventor': curVentor=='unionpay'}" @click="selectVentor('unionpay')">
                                        <img :src="unionpayUrl" alt="unionpay"/>
                                    </div>
                                    <div v-else class="unactive" @click="alertMsg('unionpay')">
                                        <img :src="unionpayUrl" alt="unionpay"/>
                                    </div>
                                </el-col>
                                <!--信用卡支付：开通了且是美元结算才会显示-->
                                <el-col :span="5">
                                    <div v-if="curMechant.supportVentor && curMechant.supportVentor.indexOf('creditpay')>-1 && curCurrency==='USD'"
                                        :class="{'selected-ventor': curVentor=='creditpay'}" @click="selectVentor('creditpay')">
                                        <img :src="creditcardUrl" alt="creditpay"/>
                                    </div>
                                    <!--<div v-else class="unactive" @click="alertMsg('creditpay')">-->
                                        <!--<img :src="creditcardUrl" alt="creditpay"/>-->
                                    <!--</div>-->
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <!--付款人信息-->
                        <el-form-item>
                            <div slot="label">
                                {{$t('formlabel.name')}}
                            </div>
                            <el-input
                                clearable
                                :placeholder="$t('placeholder.name')"
                                v-model.trim="formdata.name">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <div slot="label">
                                {{$t('formlabel.phone')}}
                            </div>
                            <el-input
                                clearable
                                :placeholder="$t('placeholder.phone')"
                                v-model.trim="formdata.phone">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="email" :label="$t('formlabel.email')">
                            <el-input
                                clearable
                                type="email"
                                :placeholder="$t('placeholder.email')"
                                v-model.trim="formdata.email">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <div slot="label">
                                {{$t('formlabel.note')}}
                            </div>
                            <el-input type="textarea"
                                      :rows="2"
                                      maxlength="30"
                                      style="width: 400px"
                                      :placeholder="$t('placeholder.note')"
                                      v-model.trim="formdata.note"
                                      :clearable="true"
                                      show-word-limit>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="pay-btn">
                        <el-button @click="pay">{{$t('message.payment')}}</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-main>
        <div class="footer">
            <a href="//www.yuansfer.com" target="_blank">关于Yuansfer</a>
        </div>
    </el-container>
</template>

<script>
    import {getAllStates} from '@/http/api'
    import {afterAjax} from '@/http/http'
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
                        // {taxName: 'tax2', taxValue: '2.34'}
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
                creditcardUrl: 'https://oss.yuansfer.com/images/marketing/creditCardPay.png',
                rules: {
                    'costAmount': [
                        // {required: false, validator: checkAmount, trigger: 'blur'}
                    ],
                    'email': [
                        { required: false, message: 'Please input Email', trigger: 'blur' },
                        { type: 'email', message: 'Please input Email format', trigger: ['blur', 'change'] }
                    ]
                }
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
                        let isLessThan = (/^[0]{1}\.{0,1}[0-9]{0,2}$/.test(curVal))
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
            }
        },
        mounted: function () {
            getAllStates().then(res => {
                afterAjax(res)
                console.log(res)
            })
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
                this.curVentor = val
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
                this.$message({
                    // showClose: true,
                    message: msg,
                    type: 'warning'
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
            pay: function () { // 有线上线下两种接口
                alert(33)
            }
        }
    }
</script>

<style scoped lang="less">
    .el-container {
        width: 1170px;
        margin: 0 auto;
        .footer{
            padding: 10px 0 25px 10px;
            a{
                text-decoration: none;
                color: #000;
            }
        }
    }
    .el-header {
        background-color: #ffffff;
        line-height: 60px;
        padding: 0;
        .header-logo{
            display: inline-block;
            height: 50px;
            padding: 17px 0;
        }
        .cur-language{
            text-align: right;
            .el-button{
                background-color:#2F4051;
                color:#fff;
                border-style:none;
                height:34px;
                width: 80px;
            }
        }
    }
    .el-main {
        padding: 0;
        background-color: #fff;
        .box-header{
            box-sizing:border-box;
            width:100%;
            position:relative;
            max-height:300px;
            overflow:hidden;
            background:linear-gradient(180deg,#58b4d3 0,#695fb5 100%);
            background:-o-linear-gradient(-90deg,#58b4d3 0,#695fb5 100%);
            text-shadow:0 0 2px rgba(0,0,0,.4);
            padding:25px;
            .logo{
                width: 100px;
                height: 100px;
                border-radius: 100px;
                background-color: transparent;
                box-shadow: 0 5px 12px 0 rgba(2,2,2,.3);
                vertical-align: middle;
                display: table-cell;
                text-align: center;
                img{
                    width: 85%;
                }
            }
            .merInfo{
                height: 100px;
                vertical-align: middle;
                display: table-cell;
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
            .qrcode{
                height: 100px;
                text-align: right;
                img{
                    width: 95px;
                    padding-right: 12px;
                }
                p{
                    color: #fff;
                    font-size: 12px;
                    margin: 0;
                }
            }
        }
        .blue{
            background:linear-gradient(180deg,#58b4d3 0,#695fb5 245px);
            background:-o-linear-gradient(-90deg,#58b4d3 0,#695fb5 245px)
        }
        .el-form{
            padding: 25px;
        }
        .el-input{
            width: 400px;
        }
        .strong-num /deep/ .el-input__inner {
            /*-webkit-appearance: none;*/
            background-color: #FFF;
            background-image: none;
            /*border-radius: 4px;*/
            /*border: 1px solid #DCDFE6;*/
            /*-webkit-box-sizing: border-box;*/
            /*box-sizing: border-box;*/
            color: #ff8208;
            /*display: inline-block;*/
            /*font-size: inherit;*/
            /*height: 40px;*/
            /*line-height: 40px;*/
            /*outline: 0;*/
            padding: 0 15px;
            -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            /*width: 100%;*/
            font-weight: bold;
        }

        .cal-total-amount{
            color: #ff8208;
            font-weight: bold;
        }
        .single-word{
            padding: 0 5px;
        }
        .paymentMethod{
            .el-col{
                .unactive{
                    -webkit-filter: grayscale(100%);
                    -moz-filter: grayscale(100%);
                    /*-ms-filter: grayscale(100%);*/
                    -o-filter: grayscale(100%);
                    filter: grayscale(100%);
                    /*filter: gray;*/
                }
                div{
                    width: 180px;
                    height: 62px;
                    border: 1px solid #ddd;
                    text-align: center;
                    img{
                        padding-top: 10px;
                        width: 128px;
                    }
                }
                .selected-ventor{
                    border: 1px solid #0070ba;
                }
            }
        }
        .pay-btn{
            width: 100%;
            text-align: center;
            padding-bottom: 25px;
            .el-button{
                width: 286px;
                background: #0070ba;
                font-size: 15px;
                color: #fff;
                border-radius: 24px;
                padding: 9px 15px 11px;
                text-align: center;
                vertical-align: middle;
                text-decoration: none;
            }
        }
    }
</style>
