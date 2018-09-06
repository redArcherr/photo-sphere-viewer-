var marksConfig,isOpenImg=false,panos,PSV;

$("#parent_img").hide();

panos = [
    {
        url: './images/5.jpg',
        desc: '前言',
        target: {
            longitude: 3.848,
            latitude: 0
        }
    },
    {
        url: './images/6.jpg',
        desc: '党建引领',
        target: {
            longitude: 3.848,
            latitude: 0
        }
    },
    {
        url: './images/7.jpg',
        desc: '科学发展',
        target: {
            longitude: 3.848,
            latitude: 0
        }
    },
    {
        url: './images/1.jpg',
        desc: '文化自信',
        target: {
            longitude: 3.848,
            latitude: 0
        }
    },
    {
        url: './images/2.jpg',
        desc: '民生幸福',
        target: {
            longitude: 3.848,
            latitude: 0
        }
    },
    {
        url: './images/3.jpg',
        desc: '和谐宜居',
        target: {
            longitude: 3.848,
            latitude: 0
        }
    },
    {
        url: './images/4.jpg',
        desc: '筑梦朝阳',
        target: {
            longitude: 3.848,
            latitude: 0
        }
    }

];

PSV = new PhotoSphereViewer({
    container: 'photosphere',
    panorama: panos[0].url,
    caption: panos[0].desc,
    //gyroscope:true,
    loading_img: './assets/photosphere-logo.gif',
    //longitude_range: [-7 * Math.PI / 8, 7 * Math.PI / 8],
    //latitude_range: [-3 * Math.PI / 4, 3 * Math.PI / 4],
    anim_speed: '-2rpm',
    default_fov: 50,
    fisheye: true,
    move_speed: 1.1,
    time_anim: false,
//    mousemove_hover: true,
//    webgl: false,
    navbar: [
        'autorotate', 'markers',
        {
            title: 'Change image',
            className: 'custom-button',
            content: '↻',
            onClick: (function() {
                var i = 0;
                var loading = false;

                return function() {
                    if (loading) {
                        return;
                    }

                    i = 1 - i;
                    loading = true;
                    PSV.clearMarkers();

                    PSV.setPanorama(panos[i].url, panos[i].target, true)
                        .then(function() {
                            PSV.setCaption(panos[i].desc);
                            loading = false;
                        });
                }
            }())
        },
        'caption', 'gyroscope', 'fullscreen'
    ],
    markers: (function() {
        var a = [];
        $.getJSON("./assets/MarksConfig.json",function (data) {
                marksConfig = data;
                for(var i=0;i<marksConfig["roomMarks_0"].length;i++){
                    a.push(marksConfig["roomMarks_0"][i]);
                }
            });
        return a;
    }())
});

PSV.on('click', function(e) {
    //点击添加标记
    console.log("longitude:"+e.longitude+"  latitude:"+e.latitude);
});

PSV.on('select-marker', function(marker, dblclick) {
    if(!isOpenImg){
        //调用展示图片
        if(marker.markType==="showPicture"){
            isOpenImg=true;
            showImg(marker);
            $("#parent_img").fadeIn(500,function () {
                //alert(this.offsetTop);
            });
        }
        //调用切换场景
        if(marker.markType==="goNext"){
            goNext(marker);
        }
    }
    console.log(marksConfig);
    // if (marker.data && marker.data.deletable) {
    //   if (dblclick) {
    //     PSV.removeMarker(marker);
    //   }
    //   else {
    //     PSV.updateMarker({
    //       id: marker.id,
    //       image: 'assets/pin2.png'
    //     });
    //   }
    // }
});

PSV.on('over-marker', function(marker) {
    console.log('over', marker.id);
});

PSV.on('leave-marker', function(marker) {
    console.log('leave', marker.id);
});

PSV.on('select-marker-list', function(marker) {
    console.log('select-list', marker.id);
});

PSV.on('goto-marker-done', function(marker) {
    console.log('goto-done', marker.id);
});

//关闭图片
$("#closeImg").click(function () {
    $("#parent_img").fadeOut(500,function () {
        isOpenImg=false;
        $(".creatorImg").remove();
    });
});
//展示图片
function showImg(marker){
    var imgParent= document.getElementById("parent_img");
    var img = document.createElement("img");
    imgParent.appendChild(img);
    img.setAttribute("class", "creatorImg");
    img.src='./images/'+marker.data;
}
//切换场景
function goNext(marker) {
    var id= marker.data;
    var loading = false;
    if (loading) {
        return;
    }
    loading = true;
    PSV.clearMarkers();
    //加载新的全景文件
    PSV.setPanorama(panos[id].url, panos[id].target, true)
        .then(function() {
            PSV.setCaption(panos[id].desc);
            //设置新的mark标记
            for(var i=0;i<marksConfig["roomMarks_"+id].length;i++){
                PSV.addMarker(marksConfig["roomMarks_"+id][i]);
            }
            //console.log("long:"+PSV.longitude_range+" lat:"+PSV.latitude_range);
            loading = false;
        });
}

