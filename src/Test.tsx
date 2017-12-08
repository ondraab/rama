import * as React from 'react';
import ParsePDB from './parsePDB';
// import Molecule from './parsePDB';

export interface RamaProps {
    pdbID: string;
}

// class RamaData extends React.Component<RamaProps, object> {
//     // private molecules: Array<Molecule> = [];
//
//     render() {
//         const {pdbID} = this.props;
//         fetch('http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + pdbID)
//             .then(response =>
//                 response.json().then(data => ({
//                         data: data,
//                         status: response.status
//                     })
//                 ).then(res => {
//                     for (let mol of res.data[pdbID].molecules) {
//                         // let Mol = new Molecule(mol.entity_id, mol.chains);
//                         // this.molecules.push(Mol);
//                         for (let chain of mol.chains) {
//                             console.log(chain.chain_id);
//                         }
//                             // for (let mod of chain.models) {
//                             //     console.log(mod.model_id);
//                                 // for (let res of mod.residues) {
//                                 //     continue;
//                                 // }
//                             }
//                         // }
//                     // }
//                 }));
//         return (
//             <div className="hello">
//                 <div className="greeting">
//                     Hello {}
//                 </div>
//             </div>
//         );
//     }
// }
// export default RamaData;

class RamaData extends React.Component<RamaProps, object> {

    render () {

        const {pdbID} = this.props;
        let parsedJSON = new ParsePDB(pdbID);
        let downloadedJSON = parsedJSON.downloadAndParse()[pdbID];

        console.log(downloadedJSON);
        return (
            <div className="hello">
                <div className="greeting">
                    Hello {}
                </div>
            </div>
        );
    }
}
export default RamaData;