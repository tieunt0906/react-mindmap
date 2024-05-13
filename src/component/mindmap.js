import React from "react";
import { Diagram } from "@blink-mind/renderer-react";
// import RichTextEditorPlugin from "@blink-mind/plugin-rich-text-editor";
import { JsonSerializerPlugin } from "@blink-mind/plugin-json-serializer";
// import { ThemeSelectorPlugin } from "@blink-mind/plugin-theme-selector";
// import TopologyDiagramPlugin from "@blink-mind/plugin-topology-diagram";
// import { TopicReferencePlugin, SearchPlugin } from "@blink-mind/plugins";
// import { Toolbar } from "./toolbar/toolbar";
import { generateSimpleModel } from "../utils";
import "@blink-mind/renderer-react/lib/main.css";
// import debug from "debug";

// const log = debug("app");

const plugins = [
  // RichTextEditorPlugin(),
  // ThemeSelectorPlugin(),
  // TopicReferencePlugin(),
  // SearchPlugin(),
  // TopologyDiagramPlugin(),
  JsonSerializerPlugin(),
];

export class Mindmap extends React.Component {
  constructor(props) {
    super(props);
    this.initModel();
  }

  diagram;
  diagramRef = (ref) => {
    this.diagram = ref;
    this.setState({});
  };

  initModel() {
    const model = generateSimpleModel();
    this.state = { model };
  }

  moveToCenter = (model) => {
    setTimeout(() => {
      const diagramProps = this.diagram.getDiagramProps();
      const { controller } = diagramProps;
      controller.run("moveTopicToCenter", {
        ...diagramProps,
        topicKey: model.editorRootTopicKey,
      });
      console.log("loadMindmapSuccess");
    }, 500);
  };

  componentDidMount() {
    console.log("component did mount");
    const diagramProps = this.diagram.getDiagramProps();
    const { controller } = diagramProps;
    controller.run("setZoomFactor", {
      ...diagramProps,
      zoomFactor: 0.3,
    });

    window.addEventListener("flutterInAppWebViewPlatformReady", (event) => {
      console.log("flutter is connected");
      window.flutter_inappwebview.callHandler("loadMindmap").then((obj) => {
        console.log("loadMindmap");
        const diagramProps = this.diagram.getDiagramProps();
        const { controller } = diagramProps;
        let model = controller.run("deserializeModel", { controller, obj });
        this.diagram.openNewModel(model);
        this.moveToCenter(model);
      });
    });
  }

  // onClickUndo = (e) => {
  //   const props = this.diagram.getDiagramProps();
  //   const { controller } = props;
  //   controller.run("undo", props);
  // };

  // onClickRedo = (e) => {
  //   const props = this.diagram.getDiagramProps();
  //   const { controller } = props;
  //   controller.run("redo", props);
  // };

  renderDiagram() {
    return (
      <Diagram
        ref={this.diagramRef}
        model={this.state.model}
        onChange={this.onChange}
        plugins={plugins}
      />
    );
  }

  // renderToolbar() {
  //   const props = this.diagram.getDiagramProps();
  //   const { controller } = props;
  //   const canUndo = controller.run("canUndo", props);
  //   const canRedo = controller.run("canRedo", props);
  //   const toolbarProps = {
  //     diagram: this.diagram,
  //     onClickUndo: this.onClickUndo,
  //     onClickRedo: this.onClickRedo,
  //     canUndo,
  //     canRedo,
  //   };
  //   return <Toolbar {...toolbarProps} />;
  // }

  onChange = (model, callback) => {
    this.setState(
      {
        model,
      },
      callback
    );
  };

  render() {
    return (
      <div className="mindmap">
        {/* {this.diagram && this.renderToolbar()} */}
        {this.renderDiagram()}
      </div>
    );
  }
}

export default Mindmap;
