<template>
    <div class="cascader-container">
        <div :style="wrapStyle">
            <tm-t-select :style="itemStyle" :value="provinceList" key="provinceId" label="provinceName"
                        :selected.sync="provinceId" :placeholder="placeHolders[0]"></tm-t-select>
        </div>
        <div :style="wrapStyle">
            <tm-t-select :style="itemStyle" :value="cityList" key="cityId" label="cityName"
                     :selected.sync="cityId" :placeholder="placeHolders[1]" v-if="level >= 2"></tm-t-select>
        </div>
       <div :style="wrapStyle">
            <tm-t-select :style="itemStyle" :value="districtList" key="districtId" label="districtName"
                     :selected.sync="districtId" :placeholder="placeHolders[2]" v-if="level >= 3"></tm-t-select>
       </div>
    </div>
</template>
<script type="text/javascript">
    import Phoenix from 'phoenix';
    import tmTSelect from 'tm-t-select';

    export default Phoenix.createView({
        name: 'cascader',
        components: {tmTSelect},
        props: {
            itemStyle: {
                type: Object,
                default: function () {
                    return {
                        'width': '170px',
                        'margin-right': '10px',
                        'height': '34px',
                        'border-radius': '4px'
                    }
                }
            },
            wrapStyle: {
                type: Object
            },
            level: {
                type: [Number],
                default: 3
            },
            path: {
                type: [String]
            }
        },
        data() {
            return {
                provinceList: [],
                cityList: [],
                districtList: [],
                provinceId: '',
                cityId: '',
                districtId: '',
                province: {},
                city: {},
                district: {},
                ganged: true,
                placeHolders: ['请选择省份', '请选择城市', '请选择区县'],
                tempPlaceHolders: ['请选择省份', '请选择城市', '请选择区县'],
                isChange: false
            };
        },
        ready() {
            this.getProvinceList();
        },
        methods: {
            getProvinceList() {
                this.api('getAddress').send({}).then(res => {
                    this.provinceList = res && res.result && res.result.result || [];
                });
            },
            getCityList(province) {
                this.cityList = province.cityArr || [];
                if (this.cityId) this.city = this.findFromArr(this.cityList, 'cityId', this.cityId) || {};
            },
            getDistrictList(city) {
                this.districtList = city.disArrayList || [];
                if (this.districtId) this.district = this.findFromArr(this.districtList, 'districtId', this.districtId) || {};
            },
            findFromArr(arr, type = 'id', key) {
                var result;
                arr.forEach(obj => {
                    if (obj[type] === key) result = obj;
                });

                return result || {};
            },
            makeUpFullPath() {
                let ids = [], names = [];
                ids.push(this.provinceId);
                names.push(this.province.provinceName);
                if (this.level >= 2) {
                    ids.push(this.cityId);
                    names.push(this.city.cityName);
                }
                if (this.level === 3) {
                    ids.push(this.districtId);
                    names.push(this.district.districtName);
                }
                return {fullPathId: ids.join("|"), fullPathName: names.join("|")}
            },
            checkPass() {
                if (this.level === 1) return this.provinceId;
                if (this.level === 2) return this.provinceId && this.cityId;
                if (this.level === 3) return this.provinceId && this.cityId && this.districtId;
            },
            checkChange(){
                return this.isChange;
            },
            getAddressInfo() {
                return this.makeUpFullPath();
            }
        },
        watch: {
            provinceId(cur) {
                this.isChange = true;
                this.province = this.findFromArr(this.provinceList, 'provinceId', cur) || {};
                this.getCityList(this.province);
                this.placeHolders.$set(1, this.tempPlaceHolders[1]);
                // 是否联动；一直保持选择省份3级联动，在renderDetail的时候会导致2、3级将没有值
                if (this.ganged) {
                    this.cityId = '';
                    this.districtId = '';
                }
            },
            cityId(cur) {
                this.isChange = true;
                this.city = this.findFromArr(this.cityList, 'cityId', cur) || {};
                this.getDistrictList(this.city);
                this.placeHolders.$set(2, this.tempPlaceHolders[2]);

                // 是否联动；一直保持选择省份3级联动，在renderDetail的时候会导致2、3级将没有值
                if (this.ganged) {
                    this.districtId = '';
                }
            },
            districtId(cur) {
                this.isChange = true;
                this.district = this.findFromArr(this.districtList, 'districtId', cur) || {};
            },
            path(v){
                if(!v) return;
                let array = v.split("|");
                this.tempPlaceHolders = this.placeHolders.splice(0, array.length, ...array);
            }
        }
    });
</script>
<style lang="less" scoped>
    .cascader-container {
        display: flex;
        flex-direction: row;
    }
</style>