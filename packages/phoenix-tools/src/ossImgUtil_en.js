/**
 * ossimg help
 * https://help.aliyun.com/document_detail/32220.html?spm=5176.doc32219.6.550.geuBr2
 */


let imgStyle = {
    width: 0, //targetWidth
    height: 0, //targetHeight
    q: 100 // target质量
};

let typeStyle = {
    type: 5,
    l: '',
    e: '',
    p: '',
    bgc: ''
};

let style = '';

export default {

    /**
     * 设置宽高
     */
    setWd(w, h) {
        return `${w}w_${h}h`;
    },

    /**
     * 单边固定缩略
     * 可以对图片某一边（宽或高）进行固定到一个长度，另外一边按照比例进行调整。
     *  w	指定目标缩略图的宽度
     *  h	指定目标缩略图的高度
     *  l	目标缩略图大于原图是否处理。值是1, 即不处理，是0，表示处理	0/1, 默认是0
     */
    oneSidedScale(w, h, l) {
        if (w > 0 && h > 0) return style;
        if (w > 0) style = `${w}w`;
        if (h > 0) style = `${h}h`;
        if (l && l !== '') style += `_${l}l`;
        return style;
    },


    /**
    *指定宽高缩略
    * 可以对图片指定宽或高原图，按照长边短边进行调整。
    * w	指定目标缩略图的宽度	1-4096
    * h	指定目标缩略图的高度。	1-4096
    * e	缩放优先边， 默认值：0：长边（默认值） 由于图片缩放过程中，
      原图尺寸与缩放尺寸不一定是相同比例，需要指定以长边还是短边优先进行缩放，
      如原图200 * 400（比例1:2），
      需要缩放为100 * 100（比例1:1）.长边优先时，缩放为50 100；
      短边优先时(e=1)，缩放为`100 200`，若不特别指定，则代表长边优先
      0表示按长边优先，默认值
        1表示按短边优先
        2 强制缩略 可能会导致图片变形
    * l	目标缩略图大于原图是否处理。如果值是1, 即不处理，是0，表示处理	0/1, 默认是0
    */
    assignWDScale(w, h, e = 0, l = 0) {
        style = this.setWd(w, h);
        style += `_${e}e`;
        style += `_${l}l`;
        return style;
    },

    /**
     *强制宽高缩略
     *可以强制指定目标缩略图的高度和宽度，忽略原图的宽高比。注意这可能会导致图片变形。
     */
    forceWDScale(w, h, l) {
        return this.assignWDScale(w, h, 2, l);
    },

    /**
     * 原图按比例缩放
     * 可以通过指定一个比例百分比参数，让图片按照指定的比例进行缩略或者放大。
     *  p	倍数百分比。 小于100，即是缩小，大于100即是放大。	1-1000
     */
    scale(p = 100) {
        return (p && p !== '') ? `${p}p` : '';
    },

    /**
    *缩略后填充
    *先把图按短边优先缩略，然后再用指定颜色填充剩余区域
    * w	指定目标缩略图的宽度	1-4096
    * h	指定目标缩略图的高度。	1-4096
    * e	缩略优先边，这里必须指定值为4	4
    * bgc	指定填充的背景颜色。默认不指定，为白色填充。参数格式：<red>-<green>-<blue>bgc
      如：100-100-100bgc red,green,blue指定一个颜色	Red, green, blue[0-255]
    */
    scaleAndFill(w, h, bgc) {
        style = this.setWd(w, h) + '_4e';
        if (bgc && bgc !== '') style += `_${bgc}bgc`;
        return style;
    },

    /**
     * 自动裁剪
     * 自动裁剪表示图片先按短边缩略，然后从缩略的目标图片裁剪出中间部分得到对应指定高度和宽度的目标缩略图。
     *w	指定目标缩略图的宽度	1-4096
     *h	指定目标缩略图的高度。	1-4096
     *e	缩放优先边，这里指定按短边优化	1
     *c	是否进行裁剪。如果是想对图进行自动裁剪，必须指定为1	0，1
     *l	如果目标缩略图大于原图是否处理，值是1, 即不处理，是0，表示处理	0/1, 默认是0
     */
    autoCrop(w, h, e = 1, l = 0) {
        style = this.setWd(w, h) + '_1c';
        style += `_${e}e`;
        style += `_${l}l`;
        return style;
    },

    /**
     * type:缩放方式 1，2，3，4,5
     * 1：单边固定缩略
     * 2：指定宽高缩略
     * 3：强制宽高缩略
     * 4：按比例缩放
     * 5: 缩略后填充
     */
    getStyleByType(imgStyle, typeStyle) {
        //scale type
        switch (typeStyle.type) {
            case 1:
                style = this.oneSidedScale(imgStyle.width, imgStyle.height, typeStyle.l);
                break;
            case 2:
                style = this.assignWDScale(imgStyle.width, imgStyle.height, typeStyle.e, typeStyle.l);
                break;
            case 3:
                style = this.forceWDScale(imgStyle.width, imgStyle.height, typeStyle.l);
                break;
            case 4:
                style = this.scale(typeStyle.p);
                break;
            case 5:
                style = this.scaleAndFill(imgStyle.width, imgStyle.height, typeStyle.bgc);
                break;
            case 6:
                style = this.autoCrop(imgStyle.width, imgStyle.height);
                break;
        }
        return style;
    },

    getWaterMarkImgByWidth(width) {
        let wmImg = '';
        if (width > 690) {
            wmImg = 'd2F0ZXJtYXJrLnBuZ0A4MHA=';
        } else if (width > 277 && width < 691) {
            wmImg = 'd2F0ZXJtYXJrLnBuZ0AzMHA=';
        } else if (width < 278) {
            wmImg = 'd2F0ZXJtYXJrLnBuZ0AxMFA=';
        }
        return wmImg;
    },

    loadImgBasic(imgCdnKey, styleObj, typeObj, isAddWaterMark, imgCdnHost = window.export_minas.cdn_host || process.env.CDN) {
        let imgUrl = '';
        let filling = '_1wh'; //1wh,避免png保存jpg时黑色背景
        let end = '.jpg';
        let style = '';
        let waterMark = [];
        let waterMarkImg = '';
        if (!(imgCdnKey && imgCdnKey !== '')) return imgUrl;
        imgStyle.width = parseInt(imgStyle.width, 10);
        imgStyle.height = parseInt(imgStyle.height, 10);
        Object.assign(imgStyle, styleObj);
        Object.assign(typeStyle, typeObj);
        style = this.getStyleByType(imgStyle, typeStyle);
        //图片质量
        style += `_${imgStyle.q}q`;
        //typeStyle！=5 ,=5时设置1wh会覆盖bgc的颜色
        if (typeStyle.type !== 5 || typeStyle.type !== 6) {
            end = filling + end;
        }
        //水印
        // if (isAddWaterMark) {
        //     waterMarkImg = this.getWaterMarkImgByWidth(imgStyle.width);
        //     waterMark.push('|watermark=1'); //水印类型 图片
        //     waterMark.push(`&object=${waterMarkImg}`); //水印图片
        //     /*
        //      *t 透明度，p 位置，
        //      *x 水平边距, 就是距离图片边缘的水平距离
        //      *y 垂直边距, 就是距离图片边缘的垂直距离
        //      */
        //     waterMark.push('&t=90&p=9&x=10&y=10');
        // }
        return `${imgCdnHost}/${imgCdnKey}@${style}${end}` + waterMark.join('');
    },
    /**
     *  默认加载图片方式带水印
     */
    loadImg(key, w, h, defaultIcon = '', isAddWaterMark = true) {
        let url = this.loadImgBasic(key, {
            width: w,
            height: h
        }, {
            type: 5,
            bgc: '238-238-238'
        }, isAddWaterMark);
        defaultIcon = process.env.CDN + defaultIcon;
        url = (url && url !== '') ? url : defaultIcon;
        return url;
    },
    /**
     * 加载头像,头像不带水印
     */
    loadAvatar(key, w, h, defaultIcon = '/statics/img/default_avatar.png') {
        let url = this.loadImg(key, w, h, defaultIcon, false);
        url = window.export_minas.cdn_host + '/statics/img/default_avatar.png';
        return url;
    },
    /**
     * 加载预览的大图，目标大于原图不缩放，小于的时候按长边等比缩放
     */
    loadPreviewImg(key, w, h) {
        return this.loadImgBasic(key, {
            width: w,
            height: h
        }, {
            type: 2,
            e: 0,
            l: 1
        }, true);
    },
    /**
     * 单边加载，固定一边，另一边按比例
     * 空的一边传‘’
     */
    loadForOneSideImg(key, w, h) {
        return this.loadImgBasic(key, {
            width: w,
            height: h
        }, {
            type: 1,
            l: 0
        }, true);
    },

    /**
     * 加载带自动剪裁
     */
    loadImgUseCrop(key, w, h) {
        return this.loadImgBasic(key, {
            width: w,
            height: h
        }, {
            type: 6
        }, true);
    }
};
