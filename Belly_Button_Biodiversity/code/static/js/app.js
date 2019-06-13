function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    var url = `/metadata/${sample}`
    d3.json(url).then((data) => {
        d3.select("#sample-metadata").html("");
        Object.entries(data).forEach(([key, value]) => {
            d3.select("#sample-metadata")
            .append("h6")
            .text(`${key}: ${value}`);
        });
    });
}


function buildCharts(sample) {
    // Use `d3.json` to fetch the sample data for the plots
    var url = "/samples/" + sample;
    d3.json(url).then(function(data_in){

        // Remove svg to clear out old dataset
        // Check if there is a cleaner wat tot do this
        // d3.select('#pie').selectAll('svg').remove();
        //d3.select('#pie').remove();

        // Build the Pie chart. Use:
        //     sample_values as the values for the PIE chart
        //     otu_ids as the labels for the pie chart
        //     otu_labels as the hovertext for the chart

        var top_sample_values = data_in.sample_values.slice(0,10);
        var top_sample_lables = data_in.otu_ids.slice(0,10);
        var top_sample_hovertext = data_in.otu_labels.slice(0,10);
        //console.log(top_sample_values);

        var data = [{
            values: top_sample_values,
            labels: top_sample_lables,
            hoverinfo: top_sample_hovertext,
            hovertext: top_sample_hovertext,
            type: 'pie'
        }];

        Plotly.newPlot('pie', data);

        // Build bubble chart using the sample data
        var trace1 = {
            x: data_in.otu_ids,
            y: data_in.sample_values,
            mode: 'markers',
            text: data_in.otu_labels,
            type: 'scatter',
            marker: {
                'color': data_in.otu_ids,
                'size': data_in.sample_values,
            }
        };
        var data = [trace1];

        Plotly.newPlot('bubble', data);

    });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
