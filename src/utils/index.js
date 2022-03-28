export const queryPoint = (tree, point) => {
  let arr = [];

  for (let item of tree.queryPoint(point)) {
    arr.push(item);
  }
  return {
    result: arr,
    min: tree?.root?.minimumLow || 0,
    max: tree?.root?.maximumHigh || 0,
  };
};

export const getTracks = (data) => {
  let tracksObj = {};
  let tracks = [];
  for (let trackObjId in data) {
    if (!tracksObj[data[trackObjId].trackId]) {
      tracksObj[data[trackObjId].trackId] = {
        elements: [{ ...data[trackObjId], id: trackObjId }],
        trackId: data[trackObjId].trackId,
      };
    } else {
      let newElemens = [
        ...tracksObj[data[trackObjId].trackId].elements,
        { ...data[trackObjId], id: trackObjId },
      ].sort((a, b) => a.period[0] - b.period[0]);

      tracksObj[data[trackObjId].trackId].elements = newElemens;
    }
  }

  for (let trackId in tracksObj) {
    tracks.push(tracksObj[trackId]);
  }
  return tracks;
};
