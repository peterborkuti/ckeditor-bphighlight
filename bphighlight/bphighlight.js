import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

export default class BpHighlight extends Plugin {
  init() {
    this._defineSchema();
    this._addButton();
    this._defineConverters();
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.extend("$text", {
      allowAttributes: [ATTR_NAME],
    });
  }

  _addButton() {
    const editor = this.editor;
    editor.ui.componentFactory.add("bphighlight", () => {
      // The button will be an instance of ButtonView.
      const button = new ButtonView();

      button.set({
        label: "Highlight",
        withText: true,
      });

      button.on("execute", () => this._highlight());

      return button;
    });
  }

  _highlight() {
    const model = this.editor.model;
    const document = model.document;
    const selection = document.selection;

    if (!selection.isCollapsed) {
      const firstRange = selection.getFirstRange();

      if (firstRange) {
        const markerName = createMarkerName("" + Math.random());
        addHighlight(model, markerName, firstRange);
      }
    }
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    const data_markerToDataConfig = {
      model: ATTR_NAME,
      converterPriority: "high",
    };

    const data_markerToHighlightConfig = {
      model: ATTR_NAME,
      view: { classes: ATTR_NAME },
      converterPriority: "highest",
    };

    conversion
      .for("dataDowncast")
      .markerToHighlight(data_markerToHighlightConfig)
      .markerToData(data_markerToDataConfig);
  }
}

const ATTR_NAME = "highlight";
const SEPARATOR_INDEX = ":";

function addHighlight(model, markerName, range) {
  const schema = model.schema;
  if (!markerName || !range) return;

  model.change((writer) => {
    removeAllAttributes(writer, schema, model.markers);
    _addMarker(writer, markerName, range);
    addAllAttributes(writer, schema, model.markers);
  });
}

function createMarkerName(uuid) {
  return ATTR_NAME + SEPARATOR_INDEX + uuid;
}

function removeAllAttributes(writer, schema, markers) {
  for (const marker of markers) {
    removeAttributesForOneMarker(writer, schema, marker);
  }
}

function addAllAttributes(writer, schema, markers) {
  for (const marker of markers) {
    _addAttributesForOneMarker(writer, schema, marker);
  }
}

function removeAttributesForOneMarker(writer, schema, marker) {
  const validRanges = schema.getValidRanges([marker.getRange()], ATTR_NAME);

  for (const range of validRanges) {
    writer.removeAttribute(ATTR_NAME, range);
  }
}

function _addAttributesForOneMarker(writer, schema, marker) {
  const validRanges = schema.getValidRanges([marker.getRange()], ATTR_NAME);

  for (const range of validRanges) {
    _setAttribute(writer, range);
  }
}

function _setAttribute(writer, range) {
  writer.setAttribute(ATTR_NAME, "0", range);
}

function _addMarker(writer, markerName, range) {
  writer.addMarker(markerName, {
    range,
    usingOperation: true,
    affectsData: true,
  });
}
