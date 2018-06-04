
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@granite-elements/granite-js-dependencies-grabber/granite-js-dependencies-grabber.js';
/* global c3 */
/**
 * `granite-c3`
 * A lightweight element wrapping-up [C3.js](http://c3js.org/), D3-based chart library.
 *
 * Typical usage:
 *
 * ```html
 * <granite-c3></granite-c3>
 * ```
 *
 * Styling properties:
 * 
 * - Gauge:
 *   --c3-gauge-max-color     --c3-gauge-max-size
 *   --c3-gauge-min-color     --c3-gauge-min-size
 *   --c3-gauge-units-color   --c3-gauge-units-size
 *   --c3-gauge-value-color   --c3-gauge-value-size
 *   --c3-gauge-background-color     
 *
 * @element granite-c3
 * @blurb A lightweight element wrapping-up c3
 * @homepage index.html
 * @demo demo/index.html
 */
class GraniteC3 extends PolymerElement {
  static get template() {
    return html`
    <style>
        
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        #chart {
          display: block;
          width: 100%;
          height: 100%;
        }
    </style>

    <granite-js-dependencies-grabber 
        dependencies="[[_dependencies]]" 
        on-dependency-is-ready="_onDependencyReady" 
        debug="[[debug]]"></granite-js-dependencies-grabber>
    <div id="chart"></div>    
  `;
  }
  /** 
   * In order to statically import non ES mudules resources, you need to use `importPath`.
   * But in order to use `importPath`, for elements defined in ES modules, users should implement
   * `static get importMeta() { return import.meta; }`, and the default
   * implementation of `importPath` will  return `import.meta.url`'s path.
   * More info on @Polymer/lib/mixins/element-mixin.js`
   */
  static get importMeta() { return import.meta; } 

  static get is() { return 'granite-c3'; }
  static get properties() {
    return {
      /**
       * C3 data object
       */
      data: {
        type: Object,
        observer: '_onDataChange',
      },
      /**
       * C3 axis object
       */
      axis: {
        type: Object,
      },
      /**
       * C3 grid object
       */
      grid: {
        type: Object,
      },
      /**
       * C3 regions object
       */
      regions: {
        type: Array,
      },
      /**
       * C3 legend object
       */
      legend: {
        type: Object,
      },
      /**
       * C3 tooltip object
       */
      tooltip: {
        type: Object,
      },
      /**
       * C3 point object
       */
      point: {
        type: Object,
      },
      /**
       * C3 area object
       */
      area: {
        type: Object,
      },
      /**
       * C3 bar object
       */
      bar: {
        type: Object,
      },
      /**
       * C3 pie object
       */
      pie: {
        type: Object,
      },
      /**
       * C3 donnut object
       */
      donnut: {
        type: Object,
      },
      /**
       * C3 gauge object
       */
      gauge: {
        type: Object,
      },
      /**
       * C3 color object
       */
      color: {
        type: Object,
      },
      /**
       * C3 chart
       */
      chart: {
        type: Object,
        notify: true,
      },
      /**
       * C3 options object
       */
      options: {
        type: Object,
        value: function() {
          return {};
        },
      },
      /**
       * True if the C3 dependencies have been loaded
       * @private
       */
       _dependenciesReady: {
        type: Boolean,
        value: false,
      },
      /**
       * True if the C3 chart has been initialized
       * @private
       */
      _chartInitialized: {
        type: Boolean,
        value: false,
      },
      /**
       * If true, logs are sent to the console
       */
      debug: {
        type: Boolean,
        value: false,
      },
      /**
       * The application dependencies
       */
       _dependencies: {
        type: Array,
        value: [
          {name: 'd3', url: `${this.importPath}../../d3/dist/d3.min.js`},
          {name: 'c3', url: `${this.importPath}../../c3/c3.min.js`},
        ],
      },
      /**
       * If true, uses js hack to fix automatic vertical resizing. See https://github.com/c3js/c3/issues/1450#issuecomment-322841360
       */ 
       fixVerticalResizing: {
         type: Boolean,
         value: false
       },
       /**
        * The C3 CSS
        */
       _c3CSS: {
         type: String,
       }
    };
  }

  static get observers() {
    return [
      '_tryInitChart(data,_dependenciesReady)',
    ];
  }

  _onDependencyReady(evt) {
    if (evt.detail.name === 'c3') {
      if (this.debug) {
        console.log('[granite-c3] _onDependencyReady - C3 ready');
      }
      this._dependenciesReady = true;
    }
  }

  _initChart() {
    let explicitBindings = {
      bindto: this.$.chart,
      data: this.data,
      axis: this.axis,
      gris: this.grid,
      regions: this.regions,
      legend: this.legend,
      tooltip: this.tooltip,
      point: this.point,
      area: this.area,
      bar: this.bar,
      pie: this.pie,
      donnut: this.donnut,
      gauge: this.gauge,
      color: this.color,
    };

    for (let key in explicitBindings) {
      if (explicitBindings[key]) {
        this.options[key] = explicitBindings[key];
      }
    }

    if (this.fixVerticalResizing) {
      this.options.onresized = function() {
        this.selectChart.style('max-height', 'none');
      }
    }

    console.log('[granite-c3] _initChart', this.options);
    this.chart = c3.generate(this.options);
    this._chartInitialized = true;
  }

  _tryInitChart() {
    if (this.debug) {
      console.log('[granite-c3] _tryInitChart', this.data, this._dependenciesReady, this._chartInitialized);
    }
    if (this._dependenciesReady && !this._chartInitialized && this.data) {
      this._initChart();
    }
  }

  _onDataChange() {
    if (this.debug) {
      console.log('[granite-c3] _onDataChange', this.data);
    }
    if (this._chartInitialized) {
      this.chart.load(this.data);
    }
  }

  async _getCss() {
    let response = await fetch(`${this.importPath}../../c3/c3.min.css`);
    this._c3CSS = await response.text();
    if (this.debug) {
      console.log('[granite-c3] _getCss', this._c3CSS);
    }
    this.shadowRoot.querySelector('style').appendChild(document.createTextNode(this._c3CSS));
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.debug) {
      console.log('[granite-c3] connectedCallback', this.properties, );
    }
    this._getCss();
  }

}

window.customElements.define(GraniteC3.is, GraniteC3);
