
javascript:
window.coords='510|498 499|499 499|493 509|502 499|505';
window.ram_spy_ratio= 8; //8 spies for each ram;
window.fakeLimit= 1; //1%


function getDist(coords){
    return Math.sqrt(Math.pow(parseInt(coords[0]) - game_data.village.x, 2) +  Math.pow(parseInt(coords[1]) - game_data.village.y, 2));
}
function noCoordsError(){
    UI.ErrorMessage("No coordinates have been set");
    throw("No coordinates have been set");

}

function main(){
    hitCountApi();
    let coords = window.coords;
    let ram_spy_ratio = parseInt(window.ram_spy_ratio || 8);
    let fakeLimit = parseInt(window.fakeLimit || 1);
    if(!coords)
        noCoordsError();
    else if(coords.length <1)
        noCoordsError();

    let doc=document;
    if(window.frames.length>0 && window.main!=null)
            doc=window.main.document;
    let url=doc.URL;
    if(url.indexOf('screen=place')==-1)
        window.open('game.php?screen=place', '_self');

    let points = game_data.village.points;
    let min_pop = Math.floor(points*fakeLimit/100);
    let i=1;
    let j=1;

    while (i*2 + j*5 < min_pop)
    {
        i+=1;
        if (i % ram_spy_ratio==0)
            j+=1;
    }

    coords=coords.split(' ');
    coords = $.map(coords, function(obj){return {coords: obj.split('|'), distance: getDist(obj.split('|'))};});
    coords = coords.sort((a, b)=> a.distance-b.distance);

    let index=0;
    let farmcookie=document.cookie.match('(^|;) ?farm=([^;]*)(;|$)');
    if(farmcookie!=null)
            index=parseInt(farmcookie[2]);
    if(index>=coords.length)
            index=0;

    coords=coords[index];
    index=index+1;
    let cookie_date=new Date(2031,3,27);
    document.cookie ='farm='+index+';expires='+cookie_date.toGMTString();doc.forms[0].x.value=coords.coords[0];doc.forms[0].y.value=coords.coords[1];

    $('#place_target').find('input').val(coords[0]+'|'+coords[1]);
    doc.forms[0].spy.value=1;
    doc.forms[0].ram.value=1;
}

function hitCountApi(){
    $.getJSON(`https://api.countapi.xyz/hit/fmthemasterScripts/${countapikey}`, function(response) {
        console.log(`This script has been run ${response.value} times`);
    });
}

main();;
