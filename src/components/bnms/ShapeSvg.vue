<template>
  <span>
    <svg
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      v-if="shape == 'heart'"
    >
      <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
      <g>
        <title>background</title>
        <rect
          fill="none"
          id="canvas_background"
          height="22"
          width="23"
          y="-1"
          x="-1"
        />
        <g
          display="none"
          overflow="visible"
          y="0"
          x="0"
          height="100%"
          width="100%"
          id="canvasGrid"
        >
          <rect
            fill="url(#gridpattern)"
            stroke-width="0"
            y="0"
            x="0"
            height="100%"
            width="100%"
          />
        </g>
      </g>
      <g>
        <path
          :stroke="color"
          id="svg_1"
          d="m10.503129,5.878334c3.452934,-9.358014 16.981644,0 0,12.031733c-16.981644,-12.031733 -3.452934,-21.389747 0,-12.031733z"
          stroke-width="1"
          :fill="color"
        />
      </g>
    </svg>
    <svg
      width="21"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      v-else-if="shape == 'hexagon'"
    >
      <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
      <g>
        <title>background</title>
        <rect
          fill="none"
          id="canvas_background"
          height="22"
          width="23"
          y="-1"
          x="-1"
        />
        <g
          display="none"
          overflow="visible"
          y="0"
          x="0"
          height="100%"
          width="100%"
          id="canvasGrid"
        >
          <rect
            fill="url(#gridpattern)"
            stroke-width="0"
            y="0"
            x="0"
            height="100%"
            width="100%"
          />
        </g>
      </g>
      <g>
        <path
          :stroke="color"
          id="svg_1"
          d="m2.064939,9.992823l3.602604,-7.95296l9.606944,0l3.602603,7.95296l-3.602603,7.95296l-9.606944,0l-3.602604,-7.95296z"
          stroke-width="1"
          :fill="color"
        />
      </g>
    </svg>
    <svg
      width="21"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      v-else-if="shape == 'pentagon'"
    >
      <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
      <g>
        <title>background</title>
        <rect
          fill="none"
          id="canvas_background"
          height="22"
          width="23"
          y="-1"
          x="-1"
        />
        <g
          display="none"
          overflow="visible"
          y="0"
          x="0"
          height="100%"
          width="100%"
          id="canvasGrid"
        >
          <rect
            fill="url(#gridpattern)"
            stroke-width="0"
            y="0"
            x="0"
            height="100%"
            width="100%"
          />
        </g>
      </g>
      <g>
        <path
          :stroke="color"
          id="svg_1"
          d="m2.078472,8.122583l8.421518,-6.075381l8.421538,6.075381l-3.216727,9.830215l-10.409593,0l-3.216736,-9.830215z"
          stroke-width="1"
          :fill="color"
        />
      </g>
    </svg>
    <svg
      width="21"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      v-else-if="shape == 'square'"
    >
      <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
      <g>
        <title>background</title>
        <rect
          fill="none"
          id="canvas_background"
          height="22"
          width="23"
          y="-1"
          x="-1"
        />
        <g
          display="none"
          overflow="visible"
          y="0"
          x="0"
          height="100%"
          width="100%"
          id="canvasGrid"
        >
          <rect
            fill="url(#gridpattern)"
            stroke-width="0"
            y="0"
            x="0"
            height="100%"
            width="100%"
          />
        </g>
      </g>
      <g>
        <rect
          :stroke="color"
          id="svg_2"
          height="15.874827"
          width="16.906065"
          y="2.045009"
          x="2.015718"
          fill-opacity="null"
          stroke-opacity="null"
          stroke-width="1"
          :fill="color"
        />
      </g>
    </svg>
    <svg
      width="21"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      v-else-if="shape == 'star-five'"
    >
      <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
      <g>
        <path
          :stroke="color"
          id="svg_2"
          d="m2.281539,8.141047l6.27839,0l1.940071,-6.015769l1.940072,6.015769l6.278389,0l-5.079315,3.717907l1.940171,6.015769l-5.079317,-3.718008l-5.079316,3.718008l1.940172,-6.015769l-5.079317,-3.717907z"
          :fill="color"
        />
      </g>
    </svg>
    <svg
      width="21"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      v-else-if="shape == 'star-six'"
    >
      <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
      <g>
        <title>background</title>
        <rect
          fill="none"
          id="canvas_background"
          height="22"
          width="23"
          y="-1"
          x="-1"
        />
        <g
          display="none"
          overflow="visible"
          y="0"
          x="0"
          height="100%"
          width="100%"
          id="canvasGrid"
        >
          <rect
            fill="url(#gridpattern)"
            stroke-width="0"
            y="0"
            x="0"
            height="100%"
            width="100%"
          />
        </g>
      </g>
      <g>
        <path
          :stroke="color"
          id="svg_1"
          d="m3.407355,13.469891l6.999756,-11.187111l6.999756,11.187111l-13.999513,0z"
          stroke-width="1"
          :fill="color"
        />
        <path
          transform="rotate(180 10.382108688354492,11.821979522705078) "
          :stroke="color"
          id="svg_2"
          d="m3.304233,17.431161l7.07787,-11.218363l7.07788,11.218363l-14.15575,0z"
          stroke-width="1"
          :fill="color"
        />
      </g>
    </svg>
    <svg
      width="21"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      v-else-if="shape == 'triangle'"
    >
      <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
      <g>
        <title>background</title>
        <rect
          fill="none"
          id="canvas_background"
          height="22"
          width="23"
          y="-1"
          x="-1"
        />
        <g
          display="none"
          overflow="visible"
          y="0"
          x="0"
          height="100%"
          width="100%"
          id="canvasGrid"
        >
          <rect
            fill="url(#gridpattern)"
            stroke-width="0"
            y="0"
            x="0"
            height="100%"
            width="100%"
          />
        </g>
      </g>
      <g>
        <path
          :stroke="color"
          id="svg_1"
          d="m2.422429,17.624477l8.077571,-15.248954l8.077571,15.248954l-16.155142,0z"
          :fill="color"
        />
      </g>
    </svg>
    <svg width="21" height="20" xmlns="http://www.w3.org/2000/svg" v-else>
      <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
      <g>
        <title>background</title>
        <rect
          fill="none"
          id="canvas_background"
          height="22"
          width="23"
          y="-1"
          x="-1"
        />
        <g
          display="none"
          overflow="visible"
          y="0"
          x="0"
          height="100%"
          width="100%"
          id="canvasGrid"
        >
          <rect
            fill="url(#gridpattern)"
            stroke-width="0"
            y="0"
            x="0"
            height="100%"
            width="100%"
          />
        </g>
      </g>
      <g>
        <ellipse
          :stroke="color"
          ry="8.09364"
          rx="8.015516"
          id="svg_1"
          cy="9.982422"
          cx="10.624998"
          stroke-width="1"
          :fill="color"
        />
      </g>
    </svg>
  </span>
</template>

<script>
export default {
  name: "shape_svg",
  props: {
    shape: {
      type: String
    },
    color: {
      type: String,
      default: "#ff4b76"
    }
  }
};
</script>

<style scoped></style>
