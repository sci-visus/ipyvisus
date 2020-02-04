
export async function fetchInfo(server, dataset) {
  const response = await fetch(`http://${server}/mod_visus?action=readdataset&dataset=${dataset}`);
  const data = await response.text();
  return parseInfo(data);
}

function parseInfo(str) {
    let o = {}, values;

    let lines = str.split('\n');
    for (let i=0; i<lines.length; i++) {
      let line = lines[i];

      switch (line) {
        case '(box)':
          values = lines[++i].split(' ');
          o.dims = {x: parseInt(values[1]) + 1, y: parseInt(values[3]) + 1, z: parseInt(values[5]) + 1}
          break;
        case '(bits)':
          o.bitmask = lines[++i];
          o.nbits = o.bitmask.length - 1;
          break;
        case ('(logic_to_physic)'):
          o.logic_to_physic = lines[++i].split(' ').map(s => parseFloat(s));
          break;
        case ('bitsperblock'):
          o.bitsperblock = parseInt(lines[++i]);
          break;
        case ('fields'):
          break;
        case ('(time)'):
          break;
      }
    }

    return o;
  }