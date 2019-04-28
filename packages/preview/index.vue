<template>
    <mask :show.sync="show"></mask>
    <layer :show.sync="show"
        :style="{ 'width' : screenWidth + 'px' }">
        <div class="view-gui" v-show="guiStatus">
            <div class="view-gui-module col">
                <div class="view-gui-line">
                    <div></div>
                    <div @click="direct( 0, 1, 0, -1 )"><i class="pv pv-top-o-arrow" title="向上"></i></div>
                    <div></div>
                </div>
                <div class="view-gui-line">
                    <div @click="direct( 1, 0, 0, 1 )"><i class="pv pv-left-o-arrow" title="向左"></i></div>
                    <div @click="reset"><i class="pv pv-yuan" title="重置"></i></div>
                    <div @click="direct( 1, 0, 0, -1 )"><i class="pv pv-right-o-arrow" title="向右"></i></div>
                </div>
                <div class="view-gui-line">
                    <div></div>
                    <div @click="direct( 0, 1, 0, 1 )"><i class="pv pv-bottom-o-arrow" title="向下"></i></div>
                    <div></div>
                </div>
            </div>
            <div class="view-gui-module">
                <div @click="direct( 0, 0, 1, -1 )"><i class="pv pv-anonymous-iconfont1" title="放大"></i></div>
                <div @click="direct( 0, 0, 1, 1 )"><i class="pv pv-anonymous-iconfont" title="缩小"></i></div>
            </div>
            <div class="view-gui-module col">
                <div class="view-gui-line">
                    <div @click="material('lambert')" :class="{ 'active' : mode === 'lambert' }">
                        <i class="pv pv-diqiu" title="默认"></i>
                    </div>
                    <div @click="material('3d')" :class="{ 'active' : mode === '3d' }">
                        <i class="pv pv-3drotation" title="3d预览"></i>
                    </div>
                </div>
                <div class="view-gui-line">
                    <div @click="material('solid')" :class="{ 'active' : mode === 'solid' }">
                        <i class="pv pv-jinlingyingcaiwangtubiao53" title="光滑"></i>
                    </div>
                    <div @click="material('wireframe')" :class="{ 'active' : mode === 'wireframe' }">
                        <i class="pv pv-diqiu1" title="线框"></i>
                    </div>
                </div>
            </div>
            <div class="view-gui-module">
                <div @click.stop="changeColor('color')" class="color-model-picker">
                    <i class="pv pv-qusehuaban" title="模型颜色"></i>
                </div>
                <div @click.stop="changeColor('bgColor')" class="color-background-picker">
                    <i class="pv pv-iconfontbeijingyanse" title="背景颜色"></i>
                </div>
                <div class="color_model" v-show="showColor" :class="{ 'ps' : isBgColor }">
                    <div id="custom-color-pick" class="cp-normal"></div>
                </div>
            </div>
            <div class="view-gui-module">
                <div @click="light( 5 )"><i class="pv pv-mingliangdu" title="光照增强"></i></div>
                <div @click="light( -5 )"><i class="pv pv-taiyang01svg" title="光照减弱"></i></div>
            </div>
        </div>
        <div class="progressMask" v-show="progressStatus" :style="{ 'width' : screenWidth + 'px' }">
            <div class="preview-progress" :show="progressStatus">
                <div class="percent"></div>
                <div class="preview-progress-percent" :style='{ "width" : progress + "%" }'>
                </div>
            </div>
        </div>
        <div class="preview-show-wrap">
            <div class="vue-preview-stage"></div>
            <!--顶部工具条-->
            <div class="view-utils">
                <div title="展开菜单" @click="guiStatus = !guiStatus" v-show="!loading"><i class="pv pv-gongju"></i></div>
                <div title="进入全屏展示" @click="f12">
                    <i class="pv" :class="{ 'pv-fangda' : !isFullScreen, 'pv-suoxiao' : isFullScreen }"></i>
                </div>
                <div title="关闭" @click="close" v-show="!isFullScreen"><i class="pv pv-guanbi"></i></div>
            </div>
            <div class="p-container" v-if="vmFiles.length > 1">
                <div class="cube" v-if="vmFiles.length > 5" @click="prev">&lt;</div>
                <div class="preview-files-nav">
                    <div class="p-list" :class="{ 'center' : vmFiles.length <= 5 }"
                        :style="vmPos">
                        <div class="cube" v-for="( k, v ) in vmFiles"
                            v-text="k+1"
                            :class="{ 'active' : k === loadModelIndex }"
                            @click="loadModel( k )"></div>
                    </div>
                </div>
                <div class="cube" v-if="vmFiles.length > 5" @click="next">&gt;</div>
            </div>
            <div class="slideBtn" @click="toggleShapeGUI( true )" v-show="!bottomGUIStatus">
                <i class="pv pv-top-arrow"></i>
            </div>
        </div>
        <div class="brightness-progress"></div>
        <div class="gui-error-confirm"></div>
        <div class="shape-gui-control" v-show="bottomGUIStatus" transition="expand">
            <ul class="shape-ctrl-switch">
                <li class="active" title="信息"><i class="pv pv-xinxi"></i></li>
            </ul>
            <div class="stage-func">
                <div class="sh-hide func-btns" title="收起菜单" @click="toggleShapeGUI( false )">
                    <i class="pv pv-bottom-arrow" style="color: #ccc"></i>
                </div>
            </div>
            <div class="shape-stage">
                <div class="stage-1 stage-item">
                    <p>
                        <span>名称：{{ cMesh_name }}</span>
                        <span>尺寸：{{ cMesh_size_x }} * {{ cMesh_size_y }} * {{ cMesh_size_z }}mm</span>
                        <span>顶点数：{{ cMesh_vertices }}</span>
                        <span>三角数：{{ cMesh_triangle }}</span>
                    </p>
                    <p>
                        <span>体积：{{ cMesh_volume }}cm<sup>3</sup></span>
                        <span>表面积：{{ cMesh_surface }}cm<sup>2</sup></span>
                    </p>
                </div>
            </div>
        </div>
    </layer>
    <toast :show.sync="toastStatus" :duration="2000">{{ toastText }}</toast>
</template>
<style lang="less" src="./assets/colorpicker.less"></style>
<style lang="less" src="./index.less" scoped></style>
<script type="text/javascript" src="./index.js"></script>
