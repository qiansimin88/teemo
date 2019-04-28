<template>
    <div>
        <mask :show.sync="show"></mask>
        <layer :show.sync="show" :style="{ width: '840px' }">
            <div class="clearfix layer-title">
                打印信息
                <span class="pull-right close" @click="close">×</span>
            </div>
            <div v-if="computedCmaterialArray.length" class="layer-container" :style="{ height: dheight + 'px', overflowY: 'scroll' }">
                <div class="special-class  flex-row" style="padding-bottom: 30px;">
                    <div class="layer-container-preview">
                        <!--模型的外包围-->
                        <div class="model-lis-ul">
                            <div class="model-lis-ul-item">
                                <div style="font-size: 16px; color: #333; padding-bottom: 6px; overflow: hidden;white-space: nowrap;text-overflow: ellipsis; width:240px;"
                                    :title="computedCmaterialArray[nowIndex]['name']"
                                >
                                    数据{{ curIndex + 1 }}：{{ computedCmaterialArray[nowIndex]['name']  }}
                                </div>
                                <div style="font-size: 12px; color: #333; line-height: 18px; padding-bottom: 8px;">
                                    <div v-if="computedCmaterialArray[nowIndex].box" class="singer-ell" style="width: 240px;">
                                        尺寸：{{ computedCmaterialArray[nowIndex].box.x }} * {{ computedCmaterialArray[nowIndex].box.y }} * {{ computedCmaterialArray[nowIndex].box.z }} mm
                                    </div>
                                    <div v-if="computedCmaterialArray[nowIndex].volume">体积： {{ computedCmaterialArray[nowIndex].volume }} cm³&nbsp;表面积：{{ computedCmaterialArray[nowIndex].area}} c㎡</div>
                                </div>
                                <div class="img-spce" v-if="computedCmaterialArray[nowIndex].dfsId">
                                    <img :src="generatorImg( computedCmaterialArray[nowIndex].dfsId, 240, posArray[cImgIndex].x, posArray[cImgIndex].y )" width="240" height="240" />
                                    <div class="abbr flex-row">
                                        <img :src="generatorImg( computedCmaterialArray[nowIndex].dfsId, 50, f.x, f.y )" width="50" height="50"
                                            :class="{ active: cImgIndex === i }"
                                            v-for="( i, f ) in posArray"
                                            @click="changeActiveImg( i )" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="computedCmaterialArray.length > 1" class="process-btn-area">
                            <div :class="{ dis: nowIndex === 0 }" @click="switchs('p')">上一个</div>
                            <div :class="{ dis: nowIndex === computedCmaterialArray.length -1 }"  @click="switchs('n')">下一个</div>
                        </div>
                    </div>
                    <div class="flex-1 layer-container-options" >
                        <div class="params-detail" v-if="matList && matList.length > 0">
                            <div class="classify">
                                <!-- 材料分类 -->
                                <div class="flex-row material-types">
                                    <div v-for="( i, m ) in matList">
                                        <div class="main-material">
                                            <div class="item"
                                                :class="{ 'active': cci === i }"
                                                @click="selectClassify( i )">
                                                {{ m.name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="material">
                                <!-- 材料选择 -->
                                <div class="flex-row" style="line-height: 26px;">
                                    <div class="child-material no-border" >材料选择：</div>
                                    <div class="cbx"
                                        :class="{ 'active' : cmi === i }"
                                        v-for="( i, t ) in matList[ cci ].result"
                                        @click="selectMaterial( i )">
                                        {{ t.name }}
                                        <div class="single_special">
                                            <div class="wrap-tips">
                                                <i class="i-model icon-wenhao"></i>
                                                <div class="tips">
                                                    {{ t.profile }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="color clearfix">
                                <span class="pull-left">材料颜色：</span>
                                <div class="pull-left clearfix">
                                    <div class="cbx pull-left"
                                        :class="{ 'active': i === coi }"
                                        @click="selectColor( i )"
                                        v-for="( i, c ) in colors">
                                        {{ c }}
                                    </div>
                                </div>
                            </div>
                            <div class="precision clearfix">
                                <span class="precision-title pull-left">材料精度：</span>
                                <div class="pull-left clearfix">
                                    <div class="cbx pull-left"
                                        :class="{ 'active': cpi === i }"
                                        @click="selectPrecision( i )"
                                        v-for="( i, pre ) in pricisionList">
                                        {{ precisionsMap[pre.name] }}
                                        （{{ pre.precisions }}）
                                    </div>
                                </div>
                            </div>
                            <div class="delivery">
                                <span>发货周期：</span>
                                {{ matList[ cci ].result[ cmi ].schedule }}个工作日
                            </div>
                            <div class="count">
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数量：</span>
                                <step-input :min="1" :max="9999" :step="1" :value.sync="quantity"></step-input>
                            </div>
                            <div v-if="priceInfo.auditPriceStatus !== 'success' && isLogin">
                                <button class="btn btn-danger btn-md" @click="save">人工报价</button>
                                <br/>
                                <br/>
                                <span style="color: #f23000; font-size: 14px;">
                                    注: 订单提交后，销售工程师审核模型与加工要求，核算价格后会以电话的方式通知您。
                                </span>
                            </div>
                            <div v-if="priceInfo.auditPriceStatus === 'success'">
                                <div class="unify-cost clearfix" v-if="gcmp && isLogin">
                                <span class="cost-prompty pull-left">
                                    <i class="i-model icon-wenhao"><span>注：系统报价仅适用于普件,最终价格以客服确认为准</span></i>
                                    总价：
                                </span>
                                    <group-switch class="pull-left"
                                                  :default-price="cmpPrice"
                                                  :group-price="gcmpPrice"
                                                  :group-desc="gdesc"
                                                  :desc="matList[ cci ].result[ cmi ].schedule"
                                                  :is-group.sync="isGroup">
                                    </group-switch>
                                </div>
                                <template v-if="!gcmp && isLogin">
                                    <div style="display: flex;flex-direction: row;align-items: center">
                                         <span class="cost-prompty pull-left">
                                            <i class="i-model icon-wenhao"><span>注：系统报价仅适用于普件,最终价格以客服确认为准</span></i>
                                                 总价：
                                        </span>
                                        <div class="cost"><span class="total-price">¥&nbsp;{{ cmpPrice }}</span></div>
                                    </div>
                                </template>
                                <button v-if="isLogin" class="btn btn-danger btn-md" @click="save">加入清单</button>
                                <!--<div v-if="isLogin && !showTips" class="cart-tip">注：产品加入清单后将同步到购物车，下次可进入购物车进行结算</div>-->
                                <div v-show="priceError">
                                <span class="getPrice-error">
                                    <i class="i-model icon-iconjs"></i>
                                    {{ priceError }}
                                </span>
                                </div>
                            </div>
                            <!--登录报价-->
                            <div v-if="!isLogin" class="getPrice clearfix">
                                <span class="pull-left">获取报价：</span>
                                <div class="pull-left getPrice-show">
                                    <div>
                                        <input v-model="userName" class="input input-height"
                                               style='margin-left:10px;width: 230px;' placeholder="请输入手机号" autocomplete="off"
                                               type="number"/>
                                    </div>
                                    <div>
                                        <vali-code
                                                :action="getValiCode"
                                                :input-width="124"
                                                :btn-width="110"
                                                :vali-code.sync="valiCode"
                                                :count="60" ref='valicode'>
                                        </vali-code>
                                    </div>
                                    <div class="getprice-btn" @click="login">获取报价</div>
                                </div>
                            </div>
                        </div>
                        <div style="color: #ff653f;padding-top: 50px;" v-if="showTips">
                            <h4 style="text-align: center;">温馨提示：</h4>
                            <h5>模型超出设备构件尺寸，不能直接打印。请联系客服，获取拼接打印加工方案。</h5>
                        </div>
                    </div>
            </div>
           </div>
        </layer>
    </div>
</template>
<script>
	import phoenix from 'phoenix';
    import layer from './layer';
    import mask from './mask';
    import stepInput from './stepInput';
    import groupSwitch from './groupSwitch';
    import valiCode from 'tm-t-valicode';
    import {setStore, loginSuc} from '../../utils/login';
    import { toDoubleDecimal, accMul, generatorImg } from '../../utils';

    export default phoenix.createView({
        name: 'material',
        props: {
            value: {
                default: false,
                type: Boolean
            },
            backup: {
                default (){
                    return {};
                },
                type: [ Object ]
            },
            dfsid: String,
            base64: Array,
            title: String,
            box: {
                type: Object,
                default () {
                    return {
                        x: 0,
                        y: 0,
                        z: 0
                    };
                }
            },
            area: {
                type: [ Number, String ]
            }
        },
        watch: {
	        quantity(v){
                this.$nextTick(() => {
                	this.calcPrice();
                })
	        }
        },
        data (){
            return {
	            valiCode: '',
                mobileRe: /^[1][3-9]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/,
                priceError: '',
                userName: null,

                dheight: 0,
                precisionsMap: {
                    "small": '普通',
                    "middle": '精细',
                    "large": '超精细'
                },
                posArray: [
                    { x: 0, y: 90 },
                    { x: 0, y: 0 },
                    { x: 0, y: 180 },
                    { x: 90, y: 90 }
                ],
                cImgIndex: 0, //当前图片索引
                colors: [], //颜色列表
                matList: [], //模型可被打印的材料，精度，颜色等
                pricisionList: [],  //精度列表
                showTips:false,
                nowIndex: 0,
                curIndex: 0,
                //------------------------
                cci: 0, //当前选中的分类索引
                cmi: 0, //当前选中的材料索引
                cmp: 0, //当前材料价格
                gcmp: 0,    //当前材料拼锅价格
                gdesc: '', //当前材料拼锅说明
                coi: 0, //当前选中的颜色索引
                cpi: 0, //当前选中的精度索引
                cpr: 0, //精度系数
                quantity: 1,    //当前选择的数量
                density: 1,//当前材料密度
                totalPrice: 0,  //当前总价格
                volume: 0,
                isGroup: true,
                isLogin: false,
                priceInfo: {},
                cmpPrice: '0', //总价
                gcmpPrice: '0', //拼锅价格
                show: false,
	            computedCmaterialArray: [],
                isBatch: false
            };
        },
        components: { layer, mask, stepInput, groupSwitch, valiCode },
        mounted () {
	        this.init();
        },
        ready() {
            this.init();
        },
        created (){
            //加入清单时确认一次精度系数就好，不用一直更新
            this.pricision = 1;
        },
        methods : {
	        generatorImg: generatorImg,
        	init() {
		        this.querySize();
		        this.dheight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.8;
		        this.api("islogin").connect()
			        .then( res => {
				        if( res.result && res.result === 'needlogin' ) {
					        this.isLogin = false;
				        }else {
					        this.isLogin = true;
				        };
			        });
            },
            showModel(cMaterialArray, index, isBatch) {
	        	this.isBatch = isBatch;
	            this.curIndex = index;
	            this.computedCmaterialArray = [...cMaterialArray];
	            this.nowIndex = isBatch ? index : 0;
	            this.$nextTick(() => {
	            	const item = this.computedCmaterialArray[this.nowIndex];
	            	const {volume, crafts} = item;
	            	this.volume = volume;
	            	if(crafts) {
	            		this.getValue(item);
                    }else {
			            this.reset();
                    }
		            this.show = true;
	            });
            },
            //还原之前的值
            getValue ( od ) { // 修改
                this.classifyReset();
                this.cci = od.crafts.cci;  //材料分类
                this.materialReset();
                this.cmi = od.crafts.cmi;
                Promise.all( [ this.getMaterialColor(), this.getMaterialPrice(), this.getMaterialPrecision() ] )
                    .then( res => {
                        this.getMaterialDensity();  //更新密度
                        this.selectPrecision( od.crafts.cpi ); //更新精度
                        this.cci = od.crafts.cci;
                        this.cmi = od.crafts.cmi;
                        this.coi = od.crafts.coi;
                        this.cpi = od.crafts.cpi;
                        this.quantity = od.crafts.quantity;
                    })
                    .catch( err => {
                        console.log( err );
                    } );
            },
            login () {
                this.priceError = '';
                if (!this.userName || !this.mobileRe.test(this.userName)) {
                    return this.priceError = '请输入有效的手机号码！';
                }
                if( !this.valicode ) {
                   return  this.priceError = '请输入有效的验证码！'
                }
                setStore('cur_user', this.userName);

                this.api('smsLogin')
                    .connect( this.userName, this.valicode )
                    .then( data => {
                        if( typeof data === 'string' ) {
                            if( data === '验证码不存在' ) {
                                return this.priceError = '验证码不存在';
                            }
                            if( data === '验证码已过期' ) {
                                return this.priceError = '验证码已过期';
                            }
                        }
                        loginSuc(data);
                        setStore('cur_user', '');
                        this.isLogin = true;
                    } )
                    .catch( err => {
                        console.warn( err );
                    } );
            },
            getValiCode(){
                // this.userNameErr = '';
                 this.priceError = '';
                if (!this.userName || !this.mobileRe.test(this.userName)) {
                    this.priceError = '请输入有效的手机号码！';
                    return Promise.reject(false);
                }
                // this.capValiSucFun = this.sendLoginCodeFetch;
                // this.shown = true;
                return this.sendLoginCodeFetch()
                    .then( data => {
                        return Promise.resolve(true);
                    } ).catch( err => {
                        return Promise.reject(false);
                    } )
                // this.shown = true;
                // return Promise.reject(false);
            },
            sendLoginCodeFetch(){
                return api('sendLoginCode').connect({
                    "phoneArea": "+86",
                    userName: this.userName,
                    siteCode: 'cn'
                }).then( data => {
                    if( data && data.result ) {
                        return Promise.resolve( true )
                    }else {
                        return Promise.reject( false )
                    }
                } ).catch( err => {
                    console.warn( err );
                } )
            },
            standardMoney: toDoubleDecimal,
            accMul: accMul,
            querySize () {
                this.showTips = false;
                this.matList = [];
                return this.api('queryAllBySize')
                    .connect( '', '', '' ) // pass empty params for unlimited result by panwang
                    .then( data => {
                        this.matList = data || [];

                        if( this.matList.length ) {
                            console.log('材料数据成功拉取');
                        }else {
                            console.log('材料数据拉取失败');
                            this.api('queryAllBySize')
                                .connect( '', '', '' ) //
                                .then( data => {
                                    return this.matList = data || [];
                                    console.log('材料数据再次成功拉取');
                                })
                                .then( data => {
                                                            // //更新材料价格
                                    this.getMaterialPrice();
                                    // //更新材料密度
                                    this.getMaterialDensity();
                                    // //异步，有顺序要求
                                    // //更新颜色 - 1
                                    this.getMaterialColor();
                                    // //更新材料精度 - 2
                                    this.getMaterialPrecision();
                                } )
                            return false;
                        }

                        if( data.length===0 ){
                            this.showTips = true;
                            return;
                        }
                        // //更新材料价格
                        this.getMaterialPrice();
                        // //更新材料密度
                        this.getMaterialDensity();
                        // //异步，有顺序要求
                        // //更新颜色 - 1
                        this.getMaterialColor();
                        // //更新材料精度 - 2
                        this.getMaterialPrecision();
                    });
            },
            //上下切换·
            switchs ( k ) {
                if( k  === 'p' ) {
                    if( this.nowIndex > 0 )
                        this.nowIndex --;
                        //重置
                        // this.reset();
                }else {
                    if( this.nowIndex < this.computedCmaterialArray.length - 1 )
                        this.nowIndex ++;
                         //重置
                        // this.reset();
                }
                //切换模型
                this.volume = this.computedCmaterialArray[this.nowIndex].volume;
	            this.calcPrice();
                this.$nextTick(() => {
                	this.curIndex = this.nowIndex;
                });
            },
            reset () {
                //重置所有的信息
                                //重置
                this.cImgIndex = 0;
                //分类，材料, 颜色, 精度，数量 全部重置
                this.modelReset();
                this.selectClassify(0);
            },
            changeGroup ( v ) {
                this.isGroup = v;
            },
            //-------------------------------------------
            //分类，材料, 颜色, 精度，数量 全部重置
            modelReset (){
                this.cci = 0;   //重置分类
                this.quantity = 1;   //重置数量
                this.classifyReset();
            },
            //分类切换时，重置材料，精度，颜色
            classifyReset (){
                this.cmi = 0;   //重置材料
                this.materialReset();
            },
            //材料切换时，重置精度，颜色
            materialReset (){
                this.cpi = 0;   //重置精度
                this.coi = 0;   //重置颜色
            },
            // //-------------------------------------------
            // //当切换分类时
            selectClassify ( index ){
                this.classifyReset();
                this.cci = index;
                //当然要更新材料的所有数据。。
                this.selectMaterial( this.cmi );
            },
            // //选择材料
            selectMaterial ( index ){
                this.materialReset();
                this.cmi = index;
                //切换材料时，要重置材料的 价格，密度，精度价格比
                this.getMaterialColor()
                    .then(this.getMaterialPrice)
                    .then(this.getMaterialPrecision)
                    .then(() => {
	                    this.getMaterialDensity();
                    	this.selectPrecision(0);
                    })
                // this.getMaterialColor(); //更新颜色
                // this.getMaterialPrice(); //更新价格
                // this.getMaterialPrecision(); //更新精度
                // this.getMaterialDensity();  //更新密度
                // this.selectPrecision( 0 ); //更新精度
            },
            //选择颜色
            selectColor ( index ){
                this.coi = index;
                //更新了颜色，也会引起材料精度的变化，所以也要更新
                this.getMaterialPrecision();
            },
            // //选择精度
            selectPrecision ( index ){
                this.cpi = index;
                //精度改变，也会更新精度系数
                this.priceRatio();
            },
            // //获取当前材料颜色
            getMaterialColor (){
                return new Promise ( ( resolve, reject ) => {
                    if( !this.matList.length ) {
                        this.api('queryAllBySize')
                                .connect( '', '', '' ) //
                                .then( data => {
                                    return this.matList = data || [];
                                })
                                .then( data => {
                                        let colors = this.matList[ this.cci ].result[ this.cmi ].color.split(';');
                                        this.colors = colors.map( c => {
                                            let color = c.split(':');
                                            return color[ 0 ];
                                        });
                                        resolve( true );
                                } )
                    }else {
                            let colors = this.matList[ this.cci ].result[ this.cmi ].color.split(';');
                            this.colors = colors.map( c => {
                                let color = c.split(':');
                                return color[ 0 ];
                            });
                            resolve( true );
                    }
                } );
            },
            //获取当前材料价格
            getMaterialPrice (){
                return new Promise( ( resolve, reject ) => {
                            if( !this.matList.length ) {
                                this.api('queryAllBySize')
                                        .connect( '', '', '' ) //
                                        .then( data => {
                                            return this.matList = data || [];
                                        })
                                        .then( data => {
	                                        this.setGroup();
                                            resolve( true );
                                        } )
                            }else {
                                    this.setGroup();
                                    resolve( true );
                            }
                } );
            },
            setGroup() {
	            let v = this.matList[ this.cci ].result[ this.cmi ];
	            this.cmp = this.standardMoney( v.price );
	            // 拼锅价 & 拼锅说明 后端 -1 代表没有拼锅价
	            if ( v.groupPrice > -1 ) {
		            this.gcmp = this.standardMoney( v.groupPrice );
		            this.gdesc = v.groupDesc || '';
		            this.isGroup = true;
	            } else {
		            this.gcmp = '';
		            this.isGroup = false;
	            }
            },
            // //获取当前材料密度
            getMaterialDensity (){
                this.density = parseFloat( this.matList[ this.cci ].result[ this.cmi ].density );
            },
            // //计算单价
            calcUnitPrice ( who ){
                //体积 * 密度 * 材料价格 * 精度系数
                return  Math.abs(this.standardMoney(this.calcUnitAccPrice( who ))).toString();
            },
            calcUnitAccPrice( who ){
              return Math.abs(this.accMul(this.volume, this.density, this[ who ], this.cpr)).toString();
            },
            // //计算总价格，用于保存时  who = 'cmp' or gcmp
            calcPrice ( who ){
                if( !this.show ) return;
                var detail = this.matList[ this.cci ].result[ this.cmi ];
                this.api( 'printOrderPrice' )
                    .connect( [
                        {
                            orderItemDtos: [{
                                quantity: this.quantity,
                                orderItemSnapshotDto: {
                                    volume: this.volume,
                                    width: this.box.y,
                                    height: this.box.z,
                                    length: this.box.x,
                                    dataDfsId: this.dfsid
                                }
                            }],
                            orderPrintFieldDto: {
                                materialId: detail.materialId,
                                precision: this.pricisionList[ this.cpi ].precisions
                            }
                        }
                    ] )
                    .then( data => {
                        if( data && data.result ) {
                            this.cmpPrice = data.result[0].orderItemDtos[0].originPrice + '';
                            this.gcmpPrice = data.result[0].orderItemDtos[0].groupPrice + '';
                            this.priceInfo = data.result[0];
                        }
                    } )
                    .catch( err => {
                        console.log( err );
                    } )
                //体积 * 密度 * 材料价格 * 精度价格比率 * 数量
                // return  Math.abs(standardMoney(this.calcUnitPrice( who ) * this.quantity)).toString();
            },
            // //根据颜色及材料id获取精度
            getMaterialPrecision (){
                return new Promise( ( resolve, reject ) => {
                    const detail = this.matList[ this.cci ].result[ this.cmi ];
                    this.api('getCanOrderSupplierPrintByCondition')
                        .connect( detail.materialId, this.colors[ this.coi ] )
                        .then( data => {
                            //更新精度列表
                            this.pricisionList = data.result.map( d => {
                                var f = d.match(/(.+):(.+)&(.+)/);
                                var backup = f[ 3 ];
                                if( backup === '已备案' ){
                                    return {
                                        name: f[ 1 ],
                                        precisions: f[ 2 ]
                                    };
                                }
                            }).filter( f => !!f );

                            //然后更新精度系数
                            this.priceRatio()
                                .then( v => {
                                    if( v )
                                    resolve( true );
                                } )
                        });
                } );
            },
            // //更新精度系数
            priceRatio (){
                return new Promise( ( resolve, reject ) => {
                        const detail = this.matList[ this.cci ].result[ this.cmi ];
                        this.api('getPrecisionByCondition')
                            .connect({
                                objectId: detail.materialId,
                                precisions: this.pricisionList[ this.cpi ].precisions
                            })
                            .then( data => {
                                this.cpr = data && data.result && data.result.length > 0 ? data.result[ 0 ].precisionsRatio : '';
                                resolve( true );
                            });
                } ).then(data => {
                	this.calcPrice();
                	return Promise.resolve(true);
                }).catch(() => {
	                return Promise.resolve(true);
                });
            },
            // //加入清单，保存当前所有索引就好了：）
            save (){
                var detail = this.matList[ this.cci ].result[ this.cmi ];

                var who = this.isGroup ? 'gcmp' : 'cmp';
	            this.$dispatch('saveModelParams', {
                    cci: this.cci,
                    categoryId: detail.classifyId,
                    cmp: this[ who ],
                    cmi: this.cmi,
                    materialName: detail.name,
                    materialId: detail.materialId,
                    coi: this.coi,
                    colorName: this.colors[ this.coi ],
                    cpi: this.cpi,
                    //精度名称
                    precisionName: this.pricisionList[ this.cpi ].precisions,
                    cpr: this.cpr,
                    quantity: this.quantity,
                    density: this.density,
                    schedule: detail.schedule,
                    // unitPrice: this.calcUnitPrice( who ),
                    unitPrice: who === 'gcmp' ? this.priceInfo.orderItemDtos[0].unitGroupPrice : this.priceInfo.orderItemDtos[0].unitPrice,
                    // unitAccPrice:this.calcUnitAccPrice( who ),
                    unitAccPrice:this.calcUnitAccPrice( who ),
                    // totalPrice: this.calcPrice( who ),
                    totalPrice: who === 'gcmp' ? this.gcmpPrice : this.cmpPrice,
                    isGroup: this.isGroup,
                    dfsId: this.dfsid,
	                auditPriceStatus: this.priceInfo.auditPriceStatus
                }, this.isBatch);
                //批量
                if( this.isBatch ) {
                	const batchPromise = this.computedCmaterialArray.map( _ => {
		                var id = _.dfsId;
		                return this.saveTraceData({
                            dfsId: id,
			                fileName: _.name,
			                materialId: detail.materialId,
			                materialName: detail.name,
			                color: this.colors[ this.coi ],
			                precision: this.pricisionList[ this.cpi ].precisions
		                });
	                } );
                    Promise.all(batchPromise)
                        .then(() => { console.log('加入销售线索成功');})
                        .catch(() => { console.log('加入销售线索失败');});
                }else {
                	this.saveTraceData({
		                dfsId: this.dfsid,
		                fileName: this.title,
		                materialId: detail.materialId,
		                materialName: detail.name,
		                color: this.colors[ this.coi ],
		                precision: this.pricisionList[ this.cpi ].precisions
                    })
		                .then(() => { console.log('加入销售线索成功');})
		                .catch(() => { console.log('加入销售线索失败');});
                }
                this.close();
            },
            saveTraceData(params) { //保存销售线索
	        	return this.api('traceSaveData').connect(params);
            },
            close (){
                this.changeActiveImg(0);
                this.modelReset();
                this.show = false;
            },
            changeActiveImg ( index ){
                this.cImgIndex = index;
            }
        }
    });
</script>
<style lang="less">
    @import '../custom';
    @import '../../assets/iconfont/iconfont.css';
.tobeFlex {
    display: flex;
    .single_special {
        flex: 1; margin-left: 3px;
        .wrap-tips{
            position: absolute;
            top: 0;
            width: 100%;
        }
        .tips {
            left: -63px;
        }
    }
}
    .special_flex,.single_special {
        position: relative;
        margin-left: 3px;
        .icon-wenhao {
            color: #ccc; font-size: 12px;cursor: pointer;
            &:hover {
                & ~ .tips {
                    display: block;
                }
            }
        }
        .tips {
            z-index: 3333;
            min-width: 335px;
            max-width: 400px;
            display: none;position: absolute; bottom: calc(100% + 12px); left: -115px; padding: 10px; background: #8a8a8a;
            color: #fff; font-size: 12px; line-height: 20px;
            border-radius: 4px;
            &:after {
                content: ""; position: absolute; bottom: -3px; left: 114px; width:0px; height: 0; border-left: 6px solid transparent;
                border-right: 6px solid transparent; border-top: 6px solid #8a8a8a;
            }
            &:before {
                content: ""; position: absolute; bottom: -6px; left: 114px; width:0px; height: 0; border-left: 6px solid transparent;
                border-right: 6px solid transparent; border-top: 6px solid #8a8a8a; z-index: 1;
            }
        }
    }
    .getPrice-error {
        padding-left: 70px; color: red;
    }
    .getprice-btn {
        width: 230px; height: 36px; text-align: center; background: @primary-color; line-height: 36px; border-radius: 3px;  font-size: 14px; color: #fff; margin-left: 10px; margin-top: 10px; cursor: pointer;
    }
    .price-error {
        color: red;
    }
    .input {
        background: #fff; border: 1px solid #dbdbdb; border-radius: 2px; height: 34px; line-height: 34px;
    }
    .getPrice-show {
    }
    .special_join{
        color: #fff!important;
        background: #ff653f;
        display: inline-block;
        height: 16px;
        width: 87px;
        position: relative;
        line-height: 16px;
        font-size: 12px;
        border-radius: 2px;
    }
    .layer-title {
        height: 50px; line-height: 50px; text-align: center;
        padding: 0 22px; font-size: 16px; font-weight: bold;
        background-color: #f8f8f8; border-bottom: .5px solid #dbdbdb;
        .close {
            font-size: 22px; cursor: pointer;margin-top: 10px;
        }
    }
    .layer-container {
        padding: 29px 24px 0px 24px; text-align: left;
        /*overflow: auto;*/
        &-preview {
            flex: 0 0 280px; height: 480px; border: 1px solid #dbdbdb; overflow: hidden;
            .model-lis-ul {
                .model-lis-ul-item {
                    padding: 20px;
                    .img-spce {
                        width: 240px;
                        .item-price {
                            display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-top: 10px;
                            span {
                                color:#ff653f;
                            }
                        }
                    }
                }
            }
            .process-btn-area {
                display: flex; justify-content: space-between; padding: 0 20px;
                div {
                    width: 80px; height: 28px; line-height: 28px; text-align: center; border: 1px solid @primary-color; color: @primary-color; cursor: pointer; font-size: 12px;
                    &:hover {
                        background: @primary-color; color: #fff;
                    }
                    &.dis {
                        color: #ccc; border-color: #dbdbdb; cursor: not-allowed;
                        &:hover {
                            background: #fff; color: #ccc;
                        }
                    }
                }
            }
            .abbr {
                margin-top: 12px; height: 50px;
                >img {
                    margin-right: 13px;
                    &.active {
                        border:2px solid #999; border-radius: 2px;
                    }
                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }
        &-options {
            color: #333; padding-left: 26px;
            a { text-decoration: none; color: #999; &:hover { color: @primary-color; } }
            .title {
                color: #333; margin-bottom: 10px;
                overflow: hidden;
                max-width: 400px;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .params {
                font-size: 12px;
                .item {
                    height: 30px; text-align: center;
                    line-height: 30px; padding: 0 10px;
                    border: .5px solid #dbdbdb;
                    &:nth-child(n+2){
                        border-left: none;
                    }
                }
            }
            .params-detail {
                font-size: 12px;
            }
            .material, .classify {
                .item {
                    width: 110px; height: 30px; background-color: #f8f8f8; color: #333;
                    line-height: 30px; text-align: center; margin-right: 7px;
                    &.active {
                        background-color: @primary-color; color: #fff;
                    }
                }
                .material-types {
                    margin: 5px 0 12px 0;
                    .main-material {
                        cursor: pointer; margin-top:12px;
                    }
                    .child-material {
                        margin: 8px 10px 0 0;
                        border: 1px solid #dbdbdb;
                        padding:0 15px;
                        cursor: pointer;
                        &.no-border {
                            border: none; padding:0;
                        }
                    }
                }
            }
            .child-material{
                margin-top:8px;
            }
            .precision-title {
                flex: 0 0 60px;
            }
            .classify, .profile, .color, .precision, .delivery, .count, .cost, .getPrice {
                line-height: 26px; padding: 8px 0;
            }
            .classify {
                padding-top: 0;
            }
            .unify-cost { margin: 15px 0 20px 0; }
            .cost-prompty {
                position: relative; width: 58px; padding-left: 3px;
                i {
                    font-size: 12px; color: #ccc; position: relative; cursor: pointer;
                    span {
                        position: absolute; bottom: 20px; left: -84px; display: none;
                        background: #999; border-radius: 2px; color: #fff;
                        height: 45px; width: 180px; padding: 5px 15px;
                        &:after {
                            position: absolute; bottom: -5px; left: 0; right: 0; margin: auto;
                            content: ''; height: 0; width: 0;
                            border-top: 5px solid #999;
                            border-left: 5px solid transparent;
                            border-right: 5px solid transparent;
                        }
                    }
                    &:hover span { display: block; }
                }
            }
            .total-price {
                color: #ff653f;
                font-size: 22px;
                font-weight: bold;
                vertical-align: middle;
            }
        }
    }
    .cbx {
        margin-right: 8px; padding: 0 20px;
        margin-bottom:2px;margin-top:8px;
        height: 26px; line-height: 24px;
        font-size: 12px; color:#666;
        border: 1px solid #e0e0e0;
        position: relative;
        border-radius: 2px; cursor: pointer;
        display: flex;
        &.active {
            border-color: @primary-color;
            &::after {
                display: block;
                content: '';
                position: absolute;
                bottom: 0;
                right: 0;
                width: 0;
                height: 0;
                border-bottom: 18px solid @primary-color;
                border-left: 18px solid transparent;
            }
            &::before {
                display: block;
                content: '';
                position: absolute;
                bottom: 4px;
                right: 1px;
                height: 3px;
                width: 7px;
                border: 2px solid #fff;
                background: @primary-color;
                z-index: 2;
                box-sizing: content-box;
                border-top: 0;
                border-right: 0;
                transform: rotate(-45deg);
            }
        }
    }
    .cart-tip{
        margin: 20px 0;
        font-weight: bold;
        font-size: 14px;
        color: #ff653f;
    }
    .singer-ell{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>
