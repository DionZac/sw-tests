function init(){
    console.log('initialize app')
    var vid = document.getElementById('myVideo')
    vid.onloadstart = function(){
        
        vid.style = 'visibility: visible';
        document.querySelector('div.loader').style = 'visibility: hidden';
        document.querySelector('h2').style = 'visibility : hidden';
        
    }
}