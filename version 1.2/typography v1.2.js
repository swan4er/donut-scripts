function removeProtocol(url){
    var urlNoProtocol = url.replace(/^https?\:\/\//i, "");
    return urlNoProtocol;
}

let domain = removeProtocol(window.location.origin);
$.post("https://donut-server.ru:8443/lib-domain", { domain: domain })
    .success(function(data) {
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", function(){
            startBlyad();
        });
        
    })
    .error(function(data) {
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", function(){
            let iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
			if (iOS)
			{
				startBlyad();
			}
			else {
					startBlyad('free');
			}
        });
        window.open('https://dev-donut.ru/error');
    })

function startBlyad(option) {
    params = JSON.parse($('#typography').attr('data-params'));
    
    var camera, scene, renderer, mesh, material;
    
    function changeMesh() {
        scene.remove(mesh);
        material = new THREE.MeshBasicMaterial();
    	switch(params.objType){
            case "cube":
                mesh = new THREE.Mesh( new THREE.BoxGeometry( parseInt(params.param1), parseInt(params.param2), parseInt(params.param3) ), material ); //ширина 70, высота 70, глубина 70
                break;
            case "sphere":
                mesh = new THREE.Mesh( new THREE.SphereGeometry( parseInt(params.param1), 32, 32 ), material ); //радиус 50, кол-во сегментов
                break;
            case "cylinder":
                mesh = new THREE.Mesh( new THREE.CylinderGeometry( parseInt(params.param1), parseInt(params.param2), parseInt(params.param3), 90 ), material ); //радиус верха 20, радиус низа 20, высота 90, кол-во сегментов
                break;
            case "torus":
                mesh = new THREE.Mesh( new THREE.TorusBufferGeometry( parseInt(params.param1), parseInt(params.param2), 50, 50 ), material ); //радиус 30, толщина 25, кол-во сегментов
                break;
    	}
    	scene.add( mesh );
    	setCanvas(params.text);
    }
    
        animate();
    	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000 );
    	camera.position.z = 125;
    	scene = new THREE.Scene();
        scene.background = new THREE.Color(parseInt(params.bgColor, 16));

        if (option != undefined) {
            alert('Используется бесплатная версия. Посетите dev-donut.ru');
            const freemap = new THREE.TextureLoader().load( 'https://static.tildacdn.com/tild3835-3731-4465-b036-373561386232/free-overlay.png' );
            const freematerial = new THREE.SpriteMaterial( { map: freemap } );
            const freesprite = new THREE.Sprite( freematerial );
            freesprite.scale.set (window.innerWidth / 4, window.innerHeight / 4, 1)
            scene.add( freesprite );
            var vec = new THREE.Vector3( 0, 0, -10 );
            vec.applyQuaternion( camera.quaternion );
            freesprite.position.copy( vec );
        }
        
    	material = new THREE.MeshBasicMaterial();
    	switch(params.objType){
            case "cube":
                mesh = new THREE.Mesh( new THREE.BoxGeometry( parseInt(params.param1), parseInt(params.param2), parseInt(params.param3) ), material ); //ширина 70, высота 70, глубина 70
                break;
            case "sphere":
                mesh = new THREE.Mesh( new THREE.SphereGeometry( parseInt(params.param1), 32, 32 ), material ); //радиус 50, кол-во сегментов
                break;
            case "cylinder":
                mesh = new THREE.Mesh( new THREE.CylinderGeometry( parseInt(params.param1), parseInt(params.param2), parseInt(params.param3), 90 ), material ); //радиус верха 20, радиус низа 20, высота 90, кол-во сегментов
                break;
            case "torus":
                mesh = new THREE.Mesh( new THREE.TorusBufferGeometry( parseInt(params.param1), parseInt(params.param2), 50, 50 ), material ); //радиус 30, толщина 25, кол-во сегментов
                break;
    	}
    	scene.add( mesh );
    	
    	
    	const canvas = document.querySelector('#typography');
		renderer = new THREE.WebGLRenderer({canvas});

    	window.addEventListener( 'resize', onWindowResize, false );
    	setCanvas(params.text);
    	onWindowResize();
    
    function setCanvas(str) {
    	var canvas = document.createElement("canvas");
    	canvas.width = params.textureSize;
    	canvas.height = params.textureSize;
    	var context = canvas.getContext( '2d' );
    	context.strokeStyle = params.textColor;
    	context.fillStyle = params.objColor;
    	context.fillRect(0, 0, canvas.width, canvas.height);
    	context.lineWidth = params.strokeWidth;
    	context.font = params.fontSize + "px " + params.font + ", Arial";
    	for	(var i = 0; i < 6; i++) {
    		context.strokeText(str, 0, i * 200);
    	}
    	material.map = new THREE.CanvasTexture( canvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping  );
    	document.getElementById('typography').appendChild(canvas);
    }
    
    function onPointerMove( event ) {
    	dispatch( events.pointermove, event );
    }
    
    var mouseX = 0;
    var mouseY = 0;
    var targetX = 0;
    var targetY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    
    function onDocumentMouseMove( event ) {
            mouseX = ( event.clientX - windowHalfX );
            mouseY = ( event.clientY - windowHalfY );
    }
    

    function onWindowResize() {
    	camera.aspect = window.innerWidth / window.innerHeight;
    	camera.updateProjectionMatrix();
    	renderer.setPixelRatio( window.devicePixelRatio );
    	renderer.setSize( window.innerWidth, window.innerHeight );
    }
    
    function animate() {
        targetX = mouseX * .001;
        targetY = mouseY * .001;
        if ( scene ) {
           	scene.rotation.y += parseFloat(params.camSens) * ( targetX - scene.rotation.y );
        	scene.rotation.x += parseFloat(params.camSens) * ( targetY - scene.rotation.x );
        }			
        
    	requestAnimationFrame( animate );
    	render();
    }

    function render() {
        if(scene){
        	material.map.offset.x -= parseFloat(params.textMoveX);
        	material.map.offset.y += parseFloat(params.textMoveY);
        	material.map.needsUpdate = true;
        	mesh.rotation.x += parseFloat(params.objRotX);
        	mesh.rotation.y -= parseFloat(params.objRotY);
        	mesh.rotation.z += parseFloat(params.objRotZ);
        	renderer.render( scene, camera );
        }
    }
}
