<template>
    <div class="upload-list-wrap">
        <div v-if="files && keys( files ) > 0" class="index-upload-area">
            <div class="upload-detail-wrap">
                <div class="upload-header" ref="scrollPoint" id="upload-header">
                    <div class="item file-info">文件信息</div>
                    <div class="item print-info">打印信息</div>
                    <div class="item cost">单价</div>
                    <div class="item count">数量</div>
                    <div class="item operator">操作</div>
                </div>
                <!--上传的文件列表-->
                <div class="upload-list" ref="uploadlist">
                    <!--单个item-->
                    <div class="upload-list-item" v-for="(key, f) in files">
                        <!-- <btn-group v-model="modelSelected"> -->
                        <!--当前的单个Item-->
                        <div class="upload-list-item-show">
                            <!--单选按钮-->
                            <!-- f.loading === false -->
                            <div class="item checkbox">
                                <label v-show="f.box" style="padding: 0;margin: 0;">
                                    <input v-model="modelSelected" :value="f.name" type="checkbox" class="checkbox-item">
                                    <div class="cb">
                                        <i class="i-model icon-fuxuanxuanze subChecked"></i>
                                        <i class="allchecked"></i>
                                    </div>
                                </label>
                            </div>
                            <!--文件信息-->
                            <div class="item model-info">
                                <!--图片-->
                                <div class="left">
                                    <div class="img">
                                        <div v-if="f.image === true">
                                            <img :src="generatorImg( f.dfsId, imageHeight, 0, 90 )"
                                                 @load="setImgHeight"
                                                 @resize="setImgHeight"
                                                 :style="{ height: imageHeight + 'px', width: imageHeight + 'px' }"/>
                                            <div v-if="f.isExample === true" class="example">示例<br>模型</div>
                                        </div>
                                        <div v-else>
                                            <div class="drawing-img" :style="{ height: imageHeight + 'px', width: imageHeight + 'px' }">
                                                <i class="i-model icon-moxing"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <p class="three-show" v-if=" !f.isMine " @click="preview3D(key, f)">
                                        3D预览
                                    </p>
                                </div>
                                <!--体积信息等-->
                                <div class="model-volume-info">
                                    <div class="model-size-info">
                                                <!--<span class="title" @mouseover="f.show=true" @mouseleave="f.show=false">-->
                                                    <!--{{f.name}}-->
                                                    <!--<p class="bubble-origin" v-if="f.show">-->
                                                        <!--<span class="bubble-desc-origin">{{f.name}}</span>-->
                                                    <!--</p>-->
                                                <!--</span>-->
                                        <span class="title">
                                                    {{f.name}}
                                            <p class="bubble-origin">
                                                <span class="bubble-desc-origin">{{f.name}}</span>
                                            </p>
                                        </span>
                                        <!--<span v-show="f.loading" style="margin-left:20px;width:56px;">-->
                                        <!--{{  convert(f.size) }}-->
                                        <!--</span>-->
                                    </div>
                                    <!--上传进度条-->
                                    <div v-if=" f.loading === true " style="margin-top: 13px;">
                                        <div class="loading-wrap">
                                            <div class="now-loading" :style="{ 'width': f.loaded + '%' }"></div>
                                            <span class="loading-data" v-text=" f.loaded + '%' "></span>
                                        </div>
                                        <p style="margin-top: 5px;">正在等待模型计算结果</p>
                                    </div>
                                    <!--上传完毕-->
                                    <div v-else class="show-other-info">
                                        <p class="size"
                                           v-text="getDesc(f)"
                                           style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;width: 200px;">
                                        </p>
                                        <p
                                                v-html=" `表面积：${ f.area } c㎡` "
                                        >
                                        </p>
                                        <p
                                                v-html="`体积：${ f.volume } cm³`"
                                        >
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <!--选择打印信息-->
                            <div class="choose-btn-wrap">
                                <!--没选择并且socker加载完毕-->
                                <div class="no-choose" v-if=" !f.crafts && f.loading === false">
                                    <!--按钮-->
                                    <div class="choose-btn"
                                         title="选择材料"
                                         @click="toSelect( f, key )" :class="{ hovershow : !key && hovershow }">
                                        选择工艺
                                    </div>
                                    <!--破损数据-->
                                    <div v-show=" f.error " class="bad-model">
                                        破损数据，临时估价<br/>
                                        下单后设计师会帮您修复数据
                                    </div>
                                </div>
                                <div class="print-info-wrap" v-if=" f.crafts && f.loading === false " @click="toSelect( f, key )">
                                    <!--模型信息-->
                                    <div class="print-info">
                                        <div class="print-info-center">
                                            <p class="singer-ell" style="width: 136px;">材料：{{ f.crafts.materialName }}</p>
                                            <p>颜色：{{ f.crafts.colorName }}</p>
                                            <p>精度：{{ f.crafts.precisionName }}</p>
                                            <p>发货周期：{{ f.crafts.schedule }}工作日</p>
                                            <p>总耗材量：{{standardMoney(f.crafts.unitAccPrice / f.crafts.cmp * f.crafts.quantity) }}g</p>
                                        </div>
                                    </div>
                                    <div class="editor">
                                        <i class="i-model icon-xiugaia"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="cost">
                                <template v-if="f.crafts && f.crafts.auditPriceStatus === 'success'" >
                                    <div class="cost-wrap">
                                        ¥{{ f.crafts.unitPrice }}
                                        <!-- {{ f.crafts | json }} -->
                                        <i v-if="f.crafts.isGroup" class="i-model icon-pinguojia"></i>
                                    </div>
                                    <div v-show=" f.error " class="bad-model">
                                        破损数据，临时估价<br/>
                                        下单后设计师会帮您修复数据
                                    </div>
                                </template>
                                <template v-if="f.crafts && f.crafts.auditPriceStatus !== 'success'">
                                    <div class="service-price">
                                        提交订单后<br/>
                                        后台人工报价
                                    </div>
                                </template>
                            </div>
                            <div class="count">
                                <div v-if="f.crafts">
                                    x{{ f.crafts && f.crafts.quantity || initNumber}}
                                </div>
                            </div>
                            <!--删除-->
                            <div class="delete-btn" v-if="!f.isExample">
                                <span @click.stop="delItem( f.name )">删除</span>
                            </div>
                        </div>
                        <!-- </btn-group> -->
                    </div>
                </div>
            </div>
            <!--计算价格区域-->
            <div class="total-price">
                <div class="all-select">
                    <label class="flex-row">
                        <input type="checkbox" v-model="allSelect" class="checkbox-item">
                        <div class="cb">
                            <!-- <i class="sale iconshow-fuxuanxuanze"></i> -->
                            <!-- <i class="allchecked" style="margin-top: 12px;"></i> -->
                            <i class="i-model icon-fuxuanxuanze subChecked"></i>
                            <i class="allchecked"></i>
                        </div>
                        <span class="drewCheck">
                                全选
                            </span>
                    </label>
                </div>
                <div class="text">
                    已选择&nbsp;<span class="orange">{{ modelSelected.length }}</span>&nbsp;件产品&nbsp;&nbsp;&nbsp;&nbsp;
                    合计：<span class="orange price" style="font-weight: 900;" v-if="!isServiceOrder">¥ {{ standardMoney(totalPrice) }}</span>
                    <span class="orange price" style="font-size: 14px;" v-if="isServiceOrder">需人工核价</span>
                    <button class="batchBtn" @click.stop="batchSelect" :disabled="!enableOrder">
                        批量选择工艺
                    </button>
                    <button class="goOrder" @click="buy" :disabled="!enableOrder">
                        立即下单
                    </button>
                </div>
            </div>
            <!--<p class="prompt">-->
                <!--<i class="i-model icon-nocation"></i>-->
                <!--<span>模型未满起步价时，以起步价格计算，多模型同材料下单，可折合起步价，最终价格以支付页为准</span>-->
            <!--</p>-->
        </div>
        <confirm btn="确认" :show.sync="confirmObj.show" :on-submit="confirmObj.action">{{confirmObj.text}}</confirm>
        <Material
              v-ref:material
              :dfsid="cMaterial.dfsId"
              :base64="cMaterial.base64"
              :title="cMaterial.name"
              :box="cMaterial.box"
              :area="cMaterial.area"
              :backup="cMaterial.crafts"
              :c-material-array="cMaterialArray">
        </Material>
        <Toast :show.sync="toastObj.show">{{ toastObj.text }}</Toast>
    </div>
</template>
<script>

    import Confirm from "./view/confirm";
    import Material from "./view/material";
    import Toast from "./view/toast";
    import { generatorImg, remoteLoad, dfsId2Name, parseModelData, parseData, toDoubleDecimal, accMul } from '../utils';
    import { socketClient, sokcetPool } from "../utils/wsUtil";

    const IMG_COEF = 0.06;

    export default {
		name: 'uploadList',
        props: {
	        files: {
		        type: Object,
		        default (){
			        return {};
		        }
	        }
        },
        data() {
			return {
				modelSelected: [],
				imageHeight: 0,
				cMaterial: {},
				cMaterialArray: [{
					name:'',
					box:{
						x:0,
						y:0,
						z:0
					},
					volume: '',
					area: '',
					dfsId: ''
				}],
                totalPrice: 0,
				isServiceOrder: false, //是否需人工核价
				allSelect: false,
                isBatch: false, //是否批量修改
                enableOrder: false, // 是否可以立即下单
				confirmObj: {
					show: false,
                    text: '',
                    action: () => {}
                },
				toastObj: {
					show: false,
                    text: ''
                }
            };
        },
        ready() {
		    this.init();
        },
        mounted() {
	        this.init();
        },
	    destroyed() {
            window.removeEventListener('resize', this.setImgHeight);
	    },
        components: {
	        Confirm,
	        Material,
	        Toast
        },
        computed: {
	        allSelect: {
		        get () {
			        return this.modelSelected.length === Object.keys(this.files).length;
		        },
		        set (v) {
			        if(v) {
				        this.modelSelected = Object.keys(this.files).map(name => {
					        return name;
				        });
			        }else {
				        this.modelSelected = [];
			        }
		        }
	        },
        },
	    watch: {
		    //被选中模型有改动时
		    modelSelected(model) {
			    this.calcTotalPrice(model);
                this.enableOrder = model && model.length > 0;
		    }
	    },
        methods: {
	        generatorImg: generatorImg,
	        standardMoney: toDoubleDecimal,
            init() {
	        	this.subWs();
	        	this.setImgHeight();
	        	window.addEventListener('resize', this.setImgHeight);
	        	this.regMaterialSave();
            },
            regMaterialSave() {
	            this.$on('saveModelParams', (data, isBatch) => {
                    if(isBatch) {
                    	this.batchUpdateMaterial(data);
                    }else {
                        this.files[this.cMaterial.name].crafts = data;
                        this.$nextTick( () => {
	                        this.cMaterialArray = Object.keys(this.files).map(name => ({...this.files[name]}));
	                        this.calcTotalPrice(this.modelSelected)
                        });
                    }
                });
            },
            calcTotalPrice(model) {
                if (!(model && model.length > 0)) {
                    this.totalPrice = 0;
                    return 0;
                }
                //过滤没有选择工艺的模型
                var prices = model.map(m => {
                    //计算单个模型总价
                    if( !this.files[m].crafts ) return 0;
                    //合价
                    if( this.files[m].crafts.auditPriceStatus !== 'success' ) return 0;
                    //过滤
                    return parseFloat(this.files[m].crafts.totalPrice);
                });
                //价格累计
                var total = prices.reduce((a, b) => a + b);
                this.isServiceOrder = model.some(m => this.files[m].crafts && this.files[m].crafts.auditPriceStatus !== 'success');
                //更新view
                this.totalPrice = total;
                return total;
            },
            batchUpdateMaterial(data) {
                const { unitPrice, totalPrice, unitAccPrice, ...others } = data;
	            const checks = this.cMaterialArray.filter(v => this.modelSelected.findIndex(o => o === v.name) !== -1);
	            const params = checks.map(v => {
	            	const { name, volume, box, dfsId } = v;
                    this.updateFiles(name, {
	                    crafts: { ...others,
                            unitPrice: 0,
                            totalPrice: 0,
                            unitAccPrice: Math.abs(accMul(volume,  data.density,  data.cmp, data.cpr)).toString()
	                    }
                    });
                    return {
	                    orderItemDtos: [{
		                    quantity: data.quantity,
		                    orderItemSnapshotDto: {
			                    volume: volume,
			                    width: box.y,
			                    height: box.z,
			                    length: box.x,
			                    dataDfsId: dfsId
		                    }
	                    }],
	                    orderPrintFieldDto: {
		                    materialId: data.materialId,
		                    precision: data.precisionName
	                    }
                    }
                });
	            this.api( 'printOrderPrice' )
		            .connect( params )
		            .then( data => {
			            if( data && data.result ) {
				            var allPriceInfo = data.result;
				            for( var n in this.files ) {
					            var item = this.files[n];
					            allPriceInfo.map( o => {
						            if( o.orderItemDtos[0].orderItemSnapshotDto.dataDfsId === item.dfsId ) {
							            const _t = this.files[n];
							            const isG = _t.crafts.isGroup;
							            this.updateFiles(n, {
							            	crafts: {
									            ..._t.crafts,
									            unitPrice: isG ? o.orderItemDtos[0].unitGroupPrice : o.orderItemDtos[0].unitPrice,
									            totalPrice: isG ? o.orderItemDtos[0].groupPrice : o.orderItemDtos[0].originPrice
								            }
							            });
							            this.$nextTick( () => {
								            this.calcTotalPrice(this.modelSelected);
							            } );
						            }
					            } );
				            }
			            }
		            } )
		            .catch( err => {
			            console.log( err );
		            } );
            },
            subWs() {
	            const sockPromise = remoteLoad('https://3dimg.oss-cn-hangzhou.aliyuncs.com/temp/sock.js');
	            const stompPromise = remoteLoad('https://3dimg.oss-cn-hangzhou.aliyuncs.com/temp/stomp.js');
	            Promise.all([sockPromise, stompPromise])
                .then(ret => {
                    // console.log('ret', ret);
	                socketClient(client => {
		                // 如果从数据详细页面来的数据需要打印下单，那么需要在此触发模型计算
		                // if ( this.dfsIdsFromDataProject.length ) {
		                //     console.log( 'this.dfsIdsFromDataProject', this.dfsIdsFromDataProject );
		                //     this.dfsIdsFromDataProject.forEach( dfsId => {
		                //     imageBeacon( dfsId )
		                //     })

		                //     this.dfsIdsFromDataProject = []
		                // }
		                // //订阅模型计算通道
		                const queue1 = client.subscribe(window.export_minas.FANOUT_MODEL, this.wsModelCalcCb);
		                sokcetPool.push(queue1.id);
		                // //图片生成队列
		                var queue2 = client.subscribe(window.export_minas.FANOUT_IMG, this.wsImgCalcCb);
		                sokcetPool.push(queue2.id);
	                },this.$route.query.debug);
                }).catch(err => {
                	console.error(err);
                })
            },
            wsModelCalcCb({body}) {//
	            var {
		            dfsId,
		            box,
		            volume,
		            area,
		            errorText,
		            error
	            } = parseModelData(body);

	            //模型计算完毕
	            var name = dfsId2Name(dfsId);
	            //没有对应关系，则不是本机的消息
	            if (!(name && name.length > 0))
		            return;
	            let item = {
		            "name": name,
		            "dfsId": dfsId,
		            "loading": false,
		            "loaded": 100,
		            "crafts": null,
		            "box": {...box},
		            "volume": volume,
		            "area": area,
		            "error": error,
		            "errorText": errorText
	            }
	            let itemArray = [];

	            if( this.modelSelected.indexOf( name ) > -1 ) {
		            let ins = this.modelSelected.indexOf( name );
		            this.modelSelected.splice( ins, 1 );
	            }
	            this.modelSelected.push( name );
	            //更新files
	            this.updateFiles(name, item);
	            this.$nextTick(() => {
		            this.cMaterialArray = Object.keys(this.files).map(name => {
			            const item = this.files[name];
			            return item;
		            });
                });
            },
            wsImgCalcCb({body}) {
                //用dfsid自己拼下url,然后塞进files
	            var {
		            dfsId,
		            imgStatus,
		            firstImg
	            } = parseData(body);

	            var name = dfsId2Name(dfsId);
	            //没有对应关系，则不是本机的消息
	            if (!(name && name.length > 0))
		            return;

	            this.updateFiles(name, {
		            "image": firstImg === 'y',
		            "preview": ~~imgStatus === 1
	            });
            },
	        setImgHeight() {
	        	const screenWidth = document.body.clientWidth;
	        	this.imageHeight = IMG_COEF * screenWidth;
            },
	        keys(p) {
		        return Object.keys(p).length;
	        },
	        updateFiles(name, obj) {
	        	this.files = {
                    ...this.files,
                    [name]: {
                        ...this.files[name],
                        ...obj
                    }
                };
                this.$nextTick(() => {
	                this.cMaterialArray = Object.keys(this.files).map(name => ({...this.files[name]}));
                });
            },
	        buy() {
		        const checks = this.cMaterialArray.filter(v => this.modelSelected.findIndex(o => o === v.name) !== -1);
		        const isAllHasCrafts = checks.every(v => !!v.crafts);
		        if(!isAllHasCrafts) {
		        	this.showToast('请先选择工艺！');
		        	return;
                }
	        	this.$dispatch('toOrder',checks);
            },
            getDesc(f) {
	        	if(!f) return '';
	        	return `尺寸：${ f.box.x } * ${  f.box.y } * ${ f.box.z } mm`;
            },
            delItem(name) {
                this.confirmObj = {
                	show: true,
                    text: '你确定要删除模型吗',
	                action: () => {
                		this.files = Object.keys(this.files).reduce((pre, cur) => {
                			if(!cur) return;
                			if(cur !== name){
                				pre[cur] = this.files[cur];
                            }
                			return pre;
                        }, {});
                		this.modelSelected = this.modelSelected.filter(v => v!==name);
                		this.cMaterialArray = this.cMaterialArray.filter(v => v.name!==name);
                		this.confirmObj = { ...this.confirmObj, show: false };
                    }
                }
            },
	        //选择工艺和修改按钮
	        toSelect(f, key) {
                const item = this.cMaterialArray.filter(v => v.name === key);
                const index = this.cMaterialArray.findIndex(v => v.name === key);
                this.cMaterial = { ...item[0] };
                this.$refs.material.showModel(item, index, false);
	        },
            batchSelect() { // 批量选择工艺或者修改
	        	const checks = this.cMaterialArray.filter(v => this.modelSelected.findIndex(o => o === v.name) !== -1);
	        	const isAllHasVolumn = checks.every(v => !!v.volume);
	        	if(this.cMaterialArray.length === Object.keys(this.files).length && isAllHasVolumn) {
			        this.cMaterial = { ...checks[0] };
			        this.$refs.material.showModel(checks, 0, true);
                } else {
	        		this.showToast('请等待模型解析后在操作！');
                }
            },
            showToast(msg) {
	        	this.toastObj = {
	        		show: true,
                    text: msg
                }
            }
		}
    };
</script>
<style scoped lang="less">

    @import "./custom";

    .upload-list-wrap {
        width: 100%;
        vertical-align: top;
        .index-upload-area {
            width: 100%;

            .prompt {
                font-size: @font-size-small;
                color: @black-2;
                display: flex;
                padding: @margin-10 0;
                .i-model {
                    color: @black-3;
                    display: inline-block;
                    margin-right: 5px;
                }
            }
            .total-price {
                display: flex;
                height: 50px;
                line-height: 50px;
                border: 1px solid #dbdbdd;
                border-top: 0;
                justify-content: space-between;
                align-items: center;
                .orange {
                    color: @sub-color;
                }
                .price {
                    font-size: 24px;
                }
                .all-select {
                    font-size: 12px;
                    color: #333;
                    width: 25%;

                    .cb {
                        width: 12%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .drewCheck {
                    }
                }
                .text {
                    display: flex;
                    align-items: center;
                    .goOrder {
                        width: @btn-size-4-width;
                        height: @btn-size-4-height;
                        line-height: @line-height-large;
                        text-align: center;
                        color: @base-color;
                        font-size: @font-size-large;
                        color: @base-color;
                        font-size: @font-size-large;
                        background: @sub-color;
                        outline: 0;
                        border: 0;
                        cursor: pointer;
                        border-radius: @border-radius-small-s;
                        margin-left: @margin-5;
                        margin-right: @margin-10;
                        &:hover {
                            background: @sub-color-hover;
                        }
                        &:disabled{
                            background: @btn-color-disable;
                            cursor: not-allowed;
                        }
                    }
                    .batchBtn {
                        width: @btn-size-4-width;
                        height: @btn-size-4-height;
                        line-height: @line-height-large;
                        text-align: center;
                        color: @base-color;
                        font-size: @font-size-large;
                        background: @primary-color;
                        outline: 0;
                        border: 0;
                        cursor: pointer;
                        margin-left: @margin-30;
                        border-radius: @border-radius-small-s;

                        &:hover {
                            background: @primary-color-hover;
                        }

                        &:disabled{
                            background: @btn-color-disable;
                            cursor: not-allowed;
                        }
                    }
                }
                color: #333;
                font-size: 14px;
            }
            .upload-detail-wrap {
                border: 1px solid @black-4;
                border-top: none;
                .upload-header {
                    font-family: @font-family-ch-bold;
                    border-bottom: none;
                    display: flex;
                    background-color: @bg-color;
                    font-size: @font-size-base;
                    color: @black-1;
                    text-align: center;
                    .item {
                        height: 45px;
                        line-height: 45px;
                        color: #333;
                    }
                    .file-info {
                        text-align: left;
                        flex: 0 0 40%;
                        margin-left: 3%;
                    }
                    .print-info {
                        flex: 0 0 15%;
                    }
                    .cost {
                        flex: 0 0 15%;
                        margin-left: 5%;
                    }
                    .count {
                        flex: 0 0 10%;
                    }
                    .operator {
                        flex: 0 0 10%;
                    }
                }
                .upload-list {
                    max-height: 416px;
                    overflow-y: auto;
                    .upload-list-item {
                        border-bottom: 1px solid @black-4;

                        .model-size-info{
                            display: flex;
                            position: relative;
                            .title {
                                overflow:hidden;
                                text-overflow:ellipsis;
                                white-space:nowrap;
                                max-width: 328px;
                                cursor: pointer;
                                &:hover{
                                    & > .bubble-origin{
                                        display: flex;
                                    }
                                }
                            }
                        }

                        &:last-child {
                            border-bottom: 0;
                        }
                        &:first-child {
                            .bubble-origin {
                                top: 30px;
                                bottom: unset;
                            }
                            .bubble-origin:before, .bubble-origin:after {
                                top: -18px;
                                bottom: unset;
                                border-style: dashed dashed solid;
                                border-color: transparent transparent #333;
                                font-size: 0;
                                line-height: 0;
                            }
                        }
                        .upload-list-item-show {
                            display: flex;
                            position: relative;
                            font-size: @font-size-small;

                            .item {
                                padding: 10px 0;
                            }

                            .checkbox {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                flex: 0 0 3%;
                            }
                            .model-info {
                                flex: 0 0 40%;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                .left {
                                    margin-top: @margin-20;
                                }

                                .img {
                                    position: relative;
                                }

                                .example {
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    margin-top: -32px;
                                    margin-left: -32px;
                                    font-size: 32px;
                                    line-height: 32px;
                                    color: #fff;
                                    opacity: 0.38;
                                    font-weight: 800;
                                    font-family: 'Microsoft YaHei', @font-family-ch-bold;
                                }

                                .three-show {
                                    text-align: center;
                                    font-size: @font-size-small;
                                    color: @black-1;
                                    line-height: @line-height-small;
                                    cursor: pointer;
                                    margin-top: @margin-5;
                                    &:hover {
                                        color: @primary-color;
                                    }
                                }
                                .drawing-img {
                                    width: 78px;
                                    height: 78px;
                                    background: #666;
                                    border-radius: 2px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    .icon-moxing {
                                        font-size: 40px;
                                        color: #999;
                                    }
                                }
                                .model-volume-info {
                                    margin-left: 10px;
                                    font-size: @font-size-small;
                                    color: @black-1;
                                    line-height: @line-height-small;
                                    width: 63%;
                                    .title {
                                        font-family: @font-family-ch-bold;
                                        font-size: @font-size-base;
                                        line-height: @line-height-base;
                                    }
                                    .loading-wrap {
                                        width: 368px;
                                        height: 5px;
                                        border-radius: 5px;
                                        background: #f5f5f5;
                                        position: relative;
                                        .loading-data {
                                            position: absolute;
                                            font-size: 14px;
                                            color: #666;
                                            right: -40px;
                                            top: -8px;
                                        }
                                        .now-loading {
                                            position: absolute;
                                            width: 0;
                                            height: 5px;
                                            background: @primary-color;
                                            border-radius: 5px;
                                            transition: width 0.2s ease-in-out;
                                        }
                                    }
                                    .show-other-info {
                                        line-height: 16px;
                                    }
                                }
                            }
                            .choose-btn-wrap {
                                flex: 0 0 15%;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                position: relative;

                                .print-info-wrap {
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border: 1px dashed transparent;

                                    &:hover {
                                        cursor: pointer;
                                        background: rgba(74, 183, 237, 0.10);
                                        border: 1px dashed rgba(0,116,255,0.11);
                                        .editor {
                                            display: block;
                                        }
                                    }
                                    .print-info {
                                        display: flex;
                                        flex: 0 0 100%;
                                        justify-content: center;
                                        align-items: center;

                                        .print-info-center {
                                            p {
                                                color: @black-1;
                                                line-height: @line-height-small;
                                                text-overflow: ellipsis;
                                                overflow: hidden;
                                                display: block;
                                                word-break:break-all;
                                            }
                                        }
                                    }
                                }
                                .editor {
                                    position: absolute;
                                    width: 20px;
                                    height: 20px;
                                    line-height: 20px;
                                    color: @base-color;
                                    text-align: center;
                                    background: @primary-color;
                                    text-align: center;
                                    right: 0;
                                    bottom: 0px;
                                    display: none;
                                    cursor: pointer;
                                    .i-model {
                                        font-size: 14px;
                                    }
                                }

                                .no-choose {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    flex-direction: column;
                                    .choose-btn {
                                        background: @primary-color;
                                        line-height: @line-height-small;
                                        font-size: @font-size-small;
                                        color: @base-color;
                                        cursor: pointer;
                                        border-radius: @border-radius-small-s;
                                        padding: 6px 7px;

                                        &:hover {
                                            background: @primary-color-hover;
                                        }
                                        &.hovershow {
                                            background: @primary-color-hover;
                                        }
                                    }
                                    .bad-model {
                                        width: 174px;
                                        height: 40px;
                                        background: #DBF1FB;
                                        border-radius: 2px;
                                        font-size: 12px;
                                        color: #666;
                                        margin-top: 9px;
                                        padding: 2px 4px 0;
                                        position: relative;
                                        line-height: 18px;
                                        &:after {
                                            width: 10px;
                                            height: 10px;
                                            background: #DBF1FB;
                                            transform: rotate(45deg);
                                            position: absolute;
                                            content: '';
                                            display: block;
                                            top: -3px;
                                            left: 80px;
                                            z-index: -1;
                                        }
                                    }
                                }
                            }
                            .cost {
                                flex: 0 0 15%;
                                color: @sub-color;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                margin-left: 5%;
                                flex-direction: column;

                                .cost-wrap {
                                    position: relative;
                                }

                                .i-model {
                                    position: absolute;
                                    bottom: 10px;
                                    left: 3px;
                                    font-size: 20px;
                                }
                                .bad-model {
                                    width: 174px;
                                    height: 40px;
                                    background: #DBF1FB;
                                    border-radius: 2px;
                                    font-size: 12px;
                                    color: #666;
                                    margin-top: 9px;
                                    padding: 2px 4px 0;
                                    line-height: 18px;
                                    /*&:after {*/
                                    /*width: 10px;*/
                                    /*height: 10px;*/
                                    /*background: #DBF1FB;*/
                                    /*transform: rotate(45deg);*/
                                    /*position: absolute;*/
                                    /*content: '';*/
                                    /*display: block;*/
                                    /*top: -3px;*/
                                    /*left: 80px;*/
                                    /*z-index: -1;*/
                                    /*}*/
                                }
                            }
                            .count {
                                flex: 0 0 10%;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                            .delete-btn {
                                flex: 0 0 10%;
                                display: flex;
                                cursor: pointer;
                                justify-content: center;
                                align-items: center;

                                span {
                                    &:hover {
                                        color: @primary-color;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .checkbox-item {
            display: none;
            &:checked ~ .cb {
                .icon-fuxuanxuanze {
                    display: block;color: @primary-color; font-size: 14px;
                }
                .allchecked {
                    display: none;
                }
            }
            &:not(:checked) ~ .cb {
                .icon-fuxuanxuanze {
                    display: none;
                }
                .allchecked {
                    display: block; color: #dbdbdb;
                }
            }
        }
        .allchecked {
            display: block;
            width: 15px;
            height: 15px;
            background: #fff;
            border: 1px solid #dbdbdb;
        }

        .bubble-origin {
            max-width: 320px;
            padding: 10px;
            position: absolute;
            z-index:999;
            background-color: #333;
            visibility: visible;
            border-radius: 2px;
            display: none;
            justify-content: center;
            align-items: center;
            bottom: 30px;left: 0;
            will-change: height, width;
        }
        .bubble-desc-origin {
            font-size: 12px;
            color: #fff;
            white-space: pre-wrap;
            text-align: justify;
            will-change: height, width;
            word-break:break-all;
        }
        .bubble-origin:before, .bubble-origin:after {
            content: "";
            display: block;
            border-width: 10px;
            position: absolute;
            bottom: -18px;
            border-style: solid dashed dashed;
            border-color: #333 transparent transparent;
            font-size: 0;
            line-height: 0;
        }

        .singer-ell{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }

    }

</style>
