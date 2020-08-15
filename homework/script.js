(() => {
    window.addEventListener('DOMContentLoaded', () => {
        // 初期化処理
        init();

        window.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'Escape':
                    run = event.key !== 'Escape';
                    break;
                case ' ':
                    isDown = true;
                    break;
                default:
            }
        }, false);
        window.addEventListener('keyup', (event) => {
            isDown = false;
        }, false);

        // 描画処理
        run = true;
        render();
    }, false);

    // 汎用変数
    let run = true; // レンダリングループフラグ
    let isDown = false; // スペースキーが押されているかどうかのフラグ

    // three.js に関連するオブジェクト用の変数
    let scene;      // シーン
    let camera;     // カメラ
    let renderer;   // レンダラ
    let geometry;   // ジオメトリ
    let material;   // マテリアル
    let box;        // ボックスメッシュ
    let boxArray    // ボックスメッシュの配列@@@
    let controls;   // カメラコントロール
    let axesHelper; // 軸ヘルパーメッシュ
    let directionalLight; // ディレクショナル・ライト（平行光源）
    let ambientLight;     // アンビエントライト（環境光）


    // カメラに関するパラメータ
    const CAMERA_PARAM = {
        fovy: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 100.0,
        x: 0.0,
        y: 2.0,
        z: 5.0,
        lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
    // レンダラに関するパラメータ
    const RENDERER_PARAM = {
        clearColor: 0x0a0a0b,
        width: window.innerWidth,
        height: window.innerHeight,
    };
    const MATERIAL_PARAM = {
        color: 0x33ffff,    // マテリアル自体の色
        specular: 0xff0000, // スペキュラ成分（反射光）の色
    };
    // ライトに関するパラメータの定義
    const DIRECTIONAL_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
        intensity: 1.0,  // 光の強度
        x: 1.0,          // 光の向きを表すベクトルの X 要素
        y: 1.0,          // 光の向きを表すベクトルの Y 要素
        z: 1.0           // 光の向きを表すベクトルの Z 要素
    };
    // アンビエントライトに関するパラメータの定義
    const AMBIENT_LIGHT_PARAM = {
        color: 0xffffff, // 光の色
        intensity: 0.2,  // 光の強度
    };

    function init(){
        // シーン
        scene = new THREE.Scene();

        // レンダラ
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        const wrapper = document.querySelector('#webgl');
        wrapper.appendChild(renderer.domElement);

        // カメラ
        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z);
        camera.lookAt(CAMERA_PARAM.lookAt);

        // ジオメトリ、マテリアル、メッシュ生成
        const boxSize = 1.0;
        geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
        const [columns, rows, depths] = [10,10,10];
        boxArray = [];
        
        [...Array(columns).keys()].map(column => {
            [...Array(rows).keys()].map(row => {
                [...Array(depths).keys()].map(depth => {
                    box = new THREE.Mesh(geometry, material);
                    box.position.x = (row - (rows / 2 + (-rows / 2 * 0.1)))
                    box.position.y = (column -(columns / 2 + (-columns / 2 * 0.1)))
                    box.position.z = (depth -(depths / 2 + (-depths / 2 * 0.1))) 
                    boxArray.push(box);
                    scene.add(box);
                    console.log(`box_r${row}c${column}d${depth}`);
                })
            })
        })
        // ディレクショナルライト
        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        // アンビエントライト
        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        // 軸ヘルパー
        axesHelper = new THREE.AxesHelper(10.0);
        scene.add(axesHelper);

        // コントロール
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render(){
        // 再帰呼び出し
        if(run === true){requestAnimationFrame(render);}

        // スペースキーが押されたフラグが立っている場合、メッシュを操作する
        if(isDown === true){
            boxArray.forEach((box) => {
                box.rotation.y += 0.05;
                box.rotation.z += 0.01;
            })
        }

        // 描画
        renderer.render(scene, camera);
    }
})();

