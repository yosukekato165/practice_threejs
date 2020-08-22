class Camera {
    constructor() {
        this.fovy = 60;
        this.aspect = window.innerWidth / window.innerHeight;
        this.near = .1;
        this.far = 30;
        this.x = 0;
        this.y = 4;
        this.z = 8;
        this.lookAt = new THREE.Vector3(0, 0, 0);
    }
}

class PointLight {
    constructor() {
        this.color = 0xffffff;
        this.intensity = 1;
        this.x = 5;
        this.y = 5;
        this.z = 10;
    }
}

class AmbientLight {
    constructor() {
        this.color = 0xffffff;
        this.intensity = .2;
    }
}

class Material {
    constructor() {
        this.color = 0xffffff;
        this.color02 = 0x74afcb;
        this.color03 = 0x1579c1;
    }
}

class Renderer {
    constructor() {
        this.clearcolor = 0x2a3a42; // 背景をクリアする色
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
}

class Scene {
    constructor() {
        this.fogColor = 0x000000; // フォグの色
        this.fogNear = 10.0;       // フォグの掛かり始めるカメラからの距離
        this.fogFar = 50.0;        // フォグが完全に掛かるカメラからの距離
    }
};

//無名関数で全体を囲んで外部から参照されないようにする。
(() => {
    //ページが読み込まれたとき
    window.addEventListener('load', () => {
        init();

        // リサイズイベントの定義
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        render();
    });

    //各種変数を作成
    let width = window.innerWidth,
        height = window.innerHeight,
        wrapper,
        scene, sceneparam,
        camera, cameraparam,
        renderer, rendererparam,
        boxwiregeometry, boxwiregeometry02, edges, edges02, boxgeometry, boxgeometry02, spheregeometry,
        boxmesh, boxmesh02, boxwireframe, boxwireframe02, spheremesh, spheremeshArray = [],
        boxwirematerial, materialparam, boxmaterial, boxmaterial02, spherematerial, ball,
        pointLight, pointlightparam, ambientLight, ambientlightparam,
        axesHelper, controls, group,
        scalar, scalarArray = [], velocity, angle;

    //各種インスタンスを作成
    sceneparam = new Scene();
    rendererparam = new Renderer();
    cameraparam = new Camera();
    materialparam = new Material();
    pointlightparam = new PointLight();
    ambientlightparam = new AmbientLight();

    //初期化処理
    function init() {
        //シーンを作成
        scene = new THREE.Scene();

        //レンダラーを作成
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(new THREE.Color(rendererparam.clearcolor));
        renderer.setSize(rendererparam.width, rendererparam.height);
        renderer.sortObjects = false;
        wrapper = document.querySelector('#webgl');
        wrapper.appendChild(renderer.domElement);

        //カメラを作成
        camera = new THREE.PerspectiveCamera(
            cameraparam.fovy,
            cameraparam.aspect,
            cameraparam.near,
            cameraparam.far,
        );
        camera.position.set(cameraparam.x, cameraparam.y, cameraparam.z);
        camera.lookAt(cameraparam.lookAt);

        //ジオメトリを作成
        boxwiregeometry = new THREE.BoxBufferGeometry(5.0, 5.0, 5.0);
        edges = new THREE.EdgesGeometry(boxwiregeometry);
        //マテリアルを作成
        boxwirematerial = new THREE.LineBasicMaterial({ color: materialparam.color });
        boxwireframe = new THREE.LineSegments(edges, boxwirematerial);

        //ジオメトリを作成
        boxwiregeometry02 = new THREE.BoxBufferGeometry(3.0, 3.0, 3.0);
        edges02 = new THREE.EdgesGeometry(boxwiregeometry02);
        //マテリアルを作成
        boxwireframe02 = new THREE.LineSegments(edges02, boxwirematerial);

        //ジオメトリを作成
        boxgeometry = new THREE.BoxGeometry(5.0, 5.0, 5.0);
        //マテリアルを作成
        boxmaterial = new THREE.MeshLambertMaterial({ color: materialparam.color02 });
        boxmaterial.transparent = true;
        boxmaterial.opacity = .6;
        //メッシュを作成
        boxmesh = new THREE.Mesh(boxgeometry, boxmaterial);

        //ジオメトリを作成
        boxgeometry02 = new THREE.BoxGeometry(3.0, 3.0, 3.0);
        //マテリアルを作成
        boxmaterial02 = new THREE.MeshLambertMaterial({ color: materialparam.color03 });
        boxmaterial02.transparent = true;
        boxmaterial02.opacity = .8;
        //メッシュを作成
        boxmesh02 = new THREE.Mesh(boxgeometry02, boxmaterial02);

        scene.add(boxwireframe02, boxmesh02, boxwireframe, boxmesh);

        //ジオメトリを作成
        spheregeometry = new THREE.SphereGeometry(.1, 32, 32);
        //マテリアルを作成
        spherematerial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        //メッシュを作成
        for (let i = 0; i < 100; i++) {
            spheremesh = new THREE.Mesh(spheregeometry, spherematerial);
            spheremeshArray.push(spheremesh);
            scene.add(spheremesh);

            angle = new THREE.Vector3(
                Math.cos(Math.PI * 2 * Math.random()),
                Math.sin(Math.PI * 2 * Math.random()),
                Math.cos(Math.PI * 2 * Math.random()),
            )
            //アニメーション
            scalar = new THREE.Vector3(0, 0, 0);
            scalar.addScaledVector(angle, Math.random() * .1 + .02);
            scalarArray.push(scalar);
        }

        //グループを作成
        group = new THREE.Group();
        group.add(boxwireframe02, boxmesh02, boxwireframe, boxmesh)
        scene.add(group)

        //ディレクショナルライト
        pointLight = new THREE.SpotLight(
            pointlightparam.color,
            pointlightparam.intensity
        );
        // pointLight.decay = 10;
        // pointLight.distance = 10;
        pointLight.position.set(50, 50, 100);
        scene.add(pointLight);

        // アンビエントライト
        ambientLight = new THREE.AmbientLight(
            ambientlightparam.color,
            ambientlightparam.intensity
        );
        scene.add(ambientLight);

        // コントロール
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render() {
        renderer.render(scene, camera);
        group.rotation.y += .01;
        for (let i = 0; i < 100; i++) {
            ball = spheremeshArray[i];
            velocity = scalarArray[i];
            ball.position.add(velocity);

            //canvas外の衝突判定
            if (ball.position.x + ball.scale.x / 2 > boxmesh02.geometry.parameters.width / 2) {
                velocity.x *= -1;
            };
            if (ball.position.x - ball.scale.x / 2 < -boxmesh02.geometry.parameters.width / 2) {
                velocity.x *= -1;
            }
            if (ball.position.y + ball.scale.y / 2 > boxmesh02.geometry.parameters.height / 2) {
                velocity.y *= -1;
            };
            if (ball.position.y - ball.scale.y / 2 < -boxmesh02.geometry.parameters.height / 2) {
                velocity.y *= -1;
            }
            if (ball.position.z + ball.scale.z / 2 > boxmesh02.geometry.parameters.depth / 2) {
                velocity.z *= -1;
            };
            if (ball.position.z - ball.scale.z / 2 < -boxmesh02.geometry.parameters.depth / 2) {
                velocity.z *= -1;
            }
        }
        requestAnimationFrame(render);
    }
})();