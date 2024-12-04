var fs = require('fs');
var xmldom = require('xmldom');
var xpath = require('xpath');

function Transformer() {
  this.processXml = function (path) {
    var DOMParser = xmldom.DOMParser;
    var XMLSerializer = xmldom.XMLSerializer;

    // Read and parse the XML file
    var xml = fs.readFileSync(path, 'utf-8');
    var doc = new DOMParser().parseFromString(xml);

    // Select all <item> nodes
    var select = xpath.useNamespaces({});
    var items = select("//item", doc);

    // Extract items and their scores
    var itemData = Array.from(items).map(item => {
      var name = select("string(name)", item);
      var score = parseFloat(select("string(score)", item));
      return { node: item, name, score };
    });

    // Sort items by score (ascending)
    itemData.sort((a, b) => a.score - b.score);

    // Rebuild the document with sorted items
    var newDoc = new DOMParser().parseFromString("<document></document>");
    var root = newDoc.documentElement;
    itemData.forEach(item => {
      root.appendChild(newDoc.importNode(item.node, true));
    });

    // Serialize the transformed document
    var result = new XMLSerializer().serializeToString(newDoc);
    return result;
  };
}

module.exports = Transformer;
