<template>
  <div class="cornerstone-element-wrapper">
    <div class="toolBar">
      <button
        v-for="tool in useButtons"
        :key="tool"
        @click="activateTool(tool)"
        :class="{ active: curTool === tool }"
      >
        {{ buttons[tool].name }}
      </button>

      <button @click="resetView">重置图像</button>
      <button @click="clearTool">清除绘制</button>
      <button @click="disableAllTools" style="display: none;">禁用</button>
      <button id="loadProgress" style="display: none;" />
    </div>
    <div class="cornerstone-element" data-index="0" oncontextmenu="return false" />
  </div>
</template>

<script>
import cornerstone from 'cornerstone-core'
import cornerstoneMath from 'cornerstone-math'
import cornerstoneTools from 'cornerstone-tools'
import cornerstoneWebImageLoader from 'cornerstone-web-image-loader'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import Hammer from 'hammerjs'

// Deep copy the imageIds
const loadProgress = {
  imageIds: null,
  total: 0,
  remaining: 0,
  percentLoaded: 0
}

// stack Scroll
const stack = {
  currentImageIdIndex: 0,
  seriesIndex: 0,
  stackId: 1,
  imageIds: []
}

export default {
  name: 'CornerstoneTools',
  props: {
    // 操作按钮
    menus: [String, Array],
    // 文件路径集合
    imagePaths: Array,
    // 文件类型 jpg  dcm两种
    fileType: {
      type: String,
      default: 'jpg'
    }
  },
  data () {
    return {
      buttons: {
        Magnify: { name: '放大镜', tool: 'Magnify' },
        Wwwc: { name: '对比度', tool: 'WW/WC' },
        Pan: { name: '移动', tool: 'Pan' },
        Rotate: { name: '旋转', tool: 'Rotate' },
        Zoom: { name: '缩放', tool: 'ZoomDrag' },
        StackScroll: { name: '滑动切换', tool: 'StackScroll' },
        Length: { name: '测距', tool: 'Length' },
        Probe: { name: '探头', tool: 'Probe' },
        CircleRoi: { name: '圆形', tool: 'Ellipse' },
        RectangleRoi: { name: '矩形', tool: 'Rectangle' },
        Angle: { name: '对角线', tool: 'Angle' }
      },
      curTool: ''
    }
  },
  computed: {
    useButtons: function () {
      let btns = []
      if (this.menus === 'all') {
        for (const p in this.buttons) {
          btns.push(p)
        }
      } else {
        btns = this.menus
      }
      return btns
    }
  },
  watch: {
    imagePaths () {
      // 切换图片路径后重新加载
      this.getStack()
      // 重置 索引
      stack.currentImageIdIndex = 0
      stack.seriesIndex = 0
      stack.stackId = 0

      this.loadImages()
    }
  },
  mounted () {
    // Setup image loader
    cornerstoneTools.external.cornerstone = cornerstone
    cornerstoneTools.external.Hammer = Hammer
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath
    if (this.fileType === 'dcm') { // 未实现
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone
      cornerstone.registerImageLoader('http', cornerstoneWADOImageLoader.loadImage)
      cornerstone.registerImageLoader('https', cornerstoneWADOImageLoader.loadImage)
    } else {
      cornerstoneWebImageLoader.external.cornerstone = cornerstone
      cornerstone.registerImageLoader('http', cornerstoneWebImageLoader.loadImage)
      cornerstone.registerImageLoader('https', cornerstoneWebImageLoader.loadImage)
    }

    // Setup tools
    cornerstoneTools.init({
      // touchEnabled: true
      mouseEnabled: true
    })

    cornerstoneTools.enableLogger()

    const element = this.getElement()
    // Enable Element
    cornerstone.enable(element)
  },
  methods: {
    // 处理dicomm路径
    getStack () {
      if (this.imagePaths && this.imagePaths.length > 0) {
        stack.imageIds = this.imagePaths
      } else {
        console.error('未提供dicom组件文件路径')
      }
    },
    loadImages () {
      if (stack.imageIds.length === 0) {
        return false
      }
      const element = this.getElement()

      // 进度  暂未使用到
      loadProgress.imageIds = stack.imageIds.slice(0)
      loadProgress.total = stack.imageIds.length
      loadProgress.remaining = stack.imageIds.length
      loadProgress.percentLoaded = 0
      function onImageLoaded (event) {
        const eventData = event.detail
        const imageId = eventData.image.imageId
        const imageIds = loadProgress.imageIds

        // Remove all instances, in case the stack repeats imageIds
        for (let i = imageIds.length - 1; i >= 0; i--) {
          if (imageIds[i] === imageId) {
            imageIds.splice(i, 1)
          }
        }

        // Populate the load progress object
        loadProgress.remaining = imageIds.length
        // loadProgress.percentLoaded = parseInt(100 - loadProgress.remaining / loadProgress.total * 100, 10)
        loadProgress.percentLoaded = Math.floor(100 - loadProgress.remaining / loadProgress.total * 100)

        if ((loadProgress.remaining / loadProgress.total) === 0) {
          console.timeEnd('Loading')
        }

        // Write to a span in the DOM
        const currentValueSpan = document.getElementById('loadProgress')
        currentValueSpan.textContent = loadProgress.percentLoaded
      }

      // Image loading events are bound to the cornerstone object, not the element
      cornerstone.events.addEventListener('cornerstoneimageloaded', onImageLoaded)

      // load images and set the stack
      cornerstone.loadImage(stack.imageIds[0]).then((image) => {
        cornerstone.displayImage(element, image)
        cornerstone.fitToWindow(element)
        cornerstoneTools.addStackStateManager(element, ['stack'])
        cornerstoneTools.addToolState(element, 'stack', stack)
      }, (err) => {
        console.log(111, err)
      })
    },
    activateTool (toolName = 'Pan') {
      this.disableAllTools()

      const element = this.getElement()

      // Add Tool
      const LengthTool = cornerstoneTools[toolName + 'Tool']
      cornerstoneTools.addToolForElement(element, LengthTool)

      // 放大镜
      if (toolName === 'Magnify') {
        const config = cornerstoneTools.getToolForElement(element, toolName).configuration
        config.magnifySize = 300
        config.magnificationLevel = 2
      }

      // stackScroll
      if (toolName === 'StackScroll') {
        const config = cornerstoneTools.getToolForElement(element, toolName).configuration
        config.allowSkipping = true
        config.loop = true
      }

      // Rotate
      if (toolName === 'Rotate') {
        const config = cornerstoneTools.getToolForElement(element, toolName).configuration
        config.rotateScale = 0.1
      }

      // Zoom
      if (toolName === 'Zoom') {
        const config = cornerstoneTools.getToolForElement(element, toolName).configuration
        config.minScale = 1
        config.maxScale = 10.0
        config.preventZoomOutsideImage = true
      }

      this.curTool = toolName

      // Set Tool Active
      // console.log(cornerstoneTools.store)
      cornerstoneTools.setToolActiveForElement(element, toolName, { mouseButtonMask: 1 })
    },
    // 重置图像
    resetView () {
      const element = this.getElement()

      // StackScroll
      if (this.curTool === 'StackScroll') {
        cornerstone.loadImage(stack.imageIds[0]).then((image) => {
          cornerstone.displayImage(element, image)
          cornerstone.fitToWindow(element)
        }, () => {
        })
      }

      // 重置图像
      cornerstone.reset(element)
      return false
    },
    // 删除绘制
    clearTool () {
      this.disableAllTools()

      const element = this.getElement()

      const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager
      // Note that this only works on ImageId-specific tool state managers (for now)
      toolStateManager.clear(element)
      cornerstone.updateImage(element)
    },
    // 按钮禁用
    disableAllTools () {
      const element = this.getElement()

      for (let i = 0; i < this.useButtons.length; i++) {
        cornerstoneTools.setToolDisabledForElement(element, this.menus[i])
      }
    },
    getElement () {
      return document.querySelector('.cornerstone-element')
    }
  }
}
</script>

<style scoped>
  .cornerstone-element-wrapper,
  .cornerstone-element {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .toolBar {
    position: fixed;
    top: 50%;
    left: 100px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
  }

  .toolBar button {
    margin-bottom: 10px;
    min-width: 90px;
    height: 50px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #cccccc;
  }

  .toolBar button.active {
    border-color: #333333;
    font-weight: bold;
    color: #6088ff;
  }
</style>
