import UIButton from './ui-button.vue';

const TMUI = {
    UIButton,
    install ( Vue ){
        console.log( Vue ); 
        Vue.component('ui-button', UIButton);
    }
};

// Automatically install TMUI if Vue is available globally
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use( TMUI );
}   

export default TMUI;

export { UIButton };