import {
    PerspectiveCamera,
    Scene,
    FogExp2,
    WebGLRenderer,
    Geometry,
    TextureLoader,
    Vector3,
    VertexColors,
    Points,
    Color,
    PointsMaterial,
    Group,
    Vector2,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import JSONLoader from './jsonLoader';
import TWEEN from '@tweenjs/tween.js'
let camera,scene,renderer,particles,geometry,index = 0,composer
let group = []
let glist = []

function Runner(elem) {
    //初始化变量
    this.init(elem)
}

Runner.prototype = {
    //创建canvas元素
    init: function (elem) {
       camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000)
       camera.position.z = 750

        //初始化场景
        scene = new Scene()
        //雾化
       scene.fog = new FogExp2(0x05050c, 0.0005, 1000)

        group = new Group()
        scene.add(group)

        //初始化renderer
        renderer = new WebGLRenderer()
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(scene.fog.color)
        document.querySelector(elem).appendChild(renderer.domElement)
        console.log(document.querySelector(elem).appendChild(renderer.domElement),"挂载");
        renderer.render(scene, camera)


        //初始化变换粒子
        this.initParticles()
        // 初始化环境粒子
        this.initAroundParticles()
        // 初始化模型
        this.initModel()
        this.late()
        this.animate()

        //开始第一个动画
        this.firstAnimation().then(() => {
           new OrbitControls(camera, renderer.domElement)
            document.querySelector('#change').onclick = () => {
                index++
                if(index > 3){
                    index = 0
                }
                this.changeModel(index)
                console.log(index);
            }
        })
    },
    //初始化变换粒子
    initParticles: function () {
        //初始化对象
        geometry = new Geometry()
        //初始化贴图
        let textureLoader = new TextureLoader()

        //小圆点
        let smallDot = textureLoader.load('json/gradient.png')

        //环境粒子数量
        const POINT_LENGTH = 7524
        //粒子大小
        const POINT_SIZE = 4
        for (let i = 0; i < POINT_LENGTH; i++) {
            let vertex = new Vector3()
            vertex.x = rangeRandom(window.innerWidth, -window.innerWidth);
            vertex.y = rangeRandom(window.innerHeight, -window.innerHeight);
            vertex.z = rangeRandom(window.innerWidth, -window.innerWidth);
            geometry.vertices.push(vertex)
            geometry.colors.push(new Color(255, 255, 255))
        }

        // 设置材质
        const material = new PointsMaterial({
            size: POINT_SIZE,
            sizeAttenuation: true,
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            map: smallDot
        })

        material.vertexColors = VertexColors
        particles = new Points(geometry, material)
        group.add(particles)
    },
    // 初始化环境粒子
    initAroundParticles: function () {
        let around = new Geometry()
        //初始化贴图
        let textureLoader = new TextureLoader()

        //小圆点
        let smallDot = textureLoader.load('json/gradient.png')
        let minZval = window.innerWidth * 0.7
        let minYVal = window.innerHeight * 0.8
        let color = new Color(255, 255, 255)

        //初始化漫游粒子
        for (let i = 0; i < 100; i++) {
            let vertex = new Vector3()
            vertex.x = rangeRandom(minZval, -minZval)
            vertex.y = rangeRandom(minYVal, -minYVal)
            vertex.z = rangeRandom(minZval, -minZval)
            around.vertices.push(vertex)
            around.colors.push(color)
        }

        //设置材质
        const aroundMaterial = new PointsMaterial({
            size: 10,
            sizeAttenuation: true,
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            map: smallDot,
        });

        aroundMaterial.vertexColors = VertexColors;
        const aroundPoints = new Points(around, aroundMaterial);
        group.add(aroundPoints)

        new TWEEN.Tween(aroundPoints.rotation)
            .to(
                {
                    y: Math.PI * 2,
                },
                200000
            )
            .repeat(Infinity)
            .start();
    },
    // 初始化模型
    initModel: function () {
        let loader = new JSONLoader()
        console.log(loader);
        //第一个文件
        loader.load('json/1game.json', (geo, materials) => {
            console.log(geo,999);
            geo.center();
            geo.normalize();

            geo.scale(500, 500, 500);
            geo.rotateX(Math.PI / 3); // 上下
            geo.rotateY(-Math.PI / 8); // 左右
            geo.rotateZ(-Math.PI / 6);
            geo.translate(-300, 100, 0);
            glist.push(geo)
            console.log(glist,888);
            
        })
        // 第二个文件
        loader.load('json/2ac.json', (geo, materials) => {
            geo.center();
            geo.normalize();

            geo.scale(500, 500, 500);

            geo.rotateY(-Math.PI / 7); // 左右
            geo.translate(280, 0, 0);

            glist.push(geo)
        })
        //第三个文件
        loader.load('json/3book.json', (geo, materials) => {
            geo.center();
            geo.normalize();

            geo.scale(700, 600, 700);

            geo.rotateY(-Math.PI / 10); // 左右
            geo.translate(-300, 100, 0);
            glist.push(geo)
        })
        //第四个文件
        loader.load('json/4movice.json', (geo, materials) => {
            geo.center();
            geo.normalize();

            geo.scale(900, 900, 900);
            geo.rotateX(Math.PI / 2);
            geo.rotateY(0.98 * Math.PI); // 左右
            glist.push(geo)
        })
        //第五个文件
        loader.load('json/5kv.json', (geo, materials) => {
            geo.center();
            geo.normalize();
            geo.scale(800, 800, 800);
            geo.translate(0, -400, 0);
            glist.push(geo)
        })
        //第六个文件，二维码
        loader.load('json/qr.json', (geo, materials) => {
            geo.center();
            geo.normalize();
            geo.scale(400, 400, 400);
            glist.push(geo)
        })
    },
    // 第一个动画函数
    firstAnimation: function () {
        let baseVal = -Math.PI * 0.6
        return new Promise((reslove, reject) => {
            group.rotation.y = baseVal
            let twInstance = new TWEEN.Tween(group.rotation)
            twInstance.to({ y: 0 }, 5000).delay(200).onComplete(() => {
                this.changeModel(0)
                reslove(true)
            }).easing(TWEEN.Easing.Sinusoidal.InOut).start()
        })
    },
    // 切换模型函数
    changeModel: function (index) {
        
        geometry.vertices.forEach((vtx, i) => {
            let twInstance = vtx.tweenvtx
            if (!twInstance) {
                twInstance = new TWEEN.Tween(vtx)
            }
            let len = glist[index].vertices.length
            
            let o = glist[index].vertices[i % len]
            twInstance
                .to(
                    {
                        x: o.x,
                        y: o.y,
                        z: o.z,
                    },
                    1000
                )
                .easing(TWEEN.Easing.Exponential.In)
                .delay(1000 * Math.random())
                .start();
        })
    },
    // 动画
    animate: function () {
        requestAnimationFrame(this.animate.bind(this)) 
        this.render()
    },
    //每帧渲染
    render: function () {
        camera.lookAt(scene.position)
        geometry.verticesNeedUpdate = true
        geometry.colorsNeedUpdate = true
        TWEEN.update()
        composer.render()
        // renderer.render(scene, camera)
    },
    //后期处理
    late: function() {
        const renderScene = new RenderPass(scene,camera)
        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth,window.innerHeight),1,10,0.5)
        bloomPass.renderToScreen = true
        bloomPass.threshold = 0
        bloomPass.strength = 0.7
        bloomPass.radius = 0.5
        bloomPass.light = 1
        composer = new EffectComposer(renderer)
        composer.setSize(window.innerWidth,window.innerHeight)
        composer.addPass(renderScene)
        composer.addPass(bloomPass)
    }
}


const rangeRandom = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);


export default Runner;
