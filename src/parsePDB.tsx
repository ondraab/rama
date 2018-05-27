interface Dictionary {
    outliersType: string[];
}

class Res {
    private aa: string;
    private phi: number;
    private psi: number;
    private rama: string;
    private chain: string;
    private num: number;
    private cisPeptide: string;
    private modelId: number;

    constructor(aa: string, phi: number, psi: number, rama: string, chain: string, num: number, cisPeptide: string,
                modelId: number) {
        this.aa = aa;
        this.phi = phi;
        this.psi = psi;
        this.rama = rama;
        this.chain = chain;
        this.num = num;
        this.cisPeptide = cisPeptide;
        this.modelId = modelId;
    }
}

export class ParsePDB {
    private pdbID: string;
    private _chainsArray: string[];
    private _modelArray: number[];
    private _residueArray: object[];
    private _rsrz: {[id: number]: Dictionary; } = {};
    private _outlDict: {[id: number]: Dictionary; } = {};

    constructor(pdb: string) {
        this.pdbID = pdb.toLowerCase();
        this._chainsArray = [];
        this._modelArray = [];
        this._residueArray = [];
    }
    //
    // public equals(obj: Model): boolean {
    //     if (thi)
    // };

    public downloadAndParse() {
        // function down() {
        //     $.ajax({
        //         url: 'http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + ,
        //         type: 'GET',
        //         dataType: 'json',
        //         data: data,
        //         success: succes
        //
        //     })
        // }
        // let request = require('request');
        //
        // let options = {
        //     url: 'http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + this.pdbID
        // };
        // function callback(error: any, response: any, body: any) {
        //     if (!error && response.statusCode === 200) {
        //         let info = JSON.parse(body);
        //         console.log(info);
        //     }
        // }
        // return request(options, callback).response;
        //
        // let url = 'http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + this.pdbID;
        // xmlHttp.onreadystatechange = function () {
        //     if (this.readyState === 4 && this.status === 200) {
        //         let myArr = JSON.parse(this.responseText);
        //         return ParsePDB.myFunction(myArr);
        //     }
        // };
        // xmlHttp.open('GET', url, true);
        // xmlHttp.send();
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET',
                     'http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + this.pdbID, false);
        xmlHttp.send();
        if (xmlHttp.status !== 200) {
            return;
        } else {
            const molecules = JSON.parse(xmlHttp.responseText)[this.pdbID];
            for (const mol of molecules.molecules) {
                // console.log(mol);
                for (const chain of mol.chains) {
                    // if (this.modelArray[this.modelArray.length - 1])
                    for (const mod of chain.models) {
                        if (this.chainsArray.indexOf(chain.chain_id) === -1) {
                            this.chainsArray.push(chain.chain_id);
                        }
                        if (this.modelArray.indexOf(mod.model_id) === -1) {
                            this._modelArray.push(mod.model_id);
                        }
                        for (const resid of mod.residues) {
                            this._residueArray.push(new Res(resid.residue_name,
                                                            resid.phi,
                                                            resid.psi,
                                                            resid.rama,
                                                            chain.chain_id,
                                                            resid.residue_number,
                                                            resid.cis_peptide,
                                                            mod.model_id
                            ));
                            // switch (resid.rama) {
                            //     case 'Favored':
                            //         fav.push(new Res(resid.residue_name,
                            //                          resid.phi,
                            //                          resid.psi,
                            //                          resid.rama,
                            //                          chain.chain_id,
                            //                          resid.residue_number));
                            //         break;
                            //     case 'Allowed':
                            //         allow.push(new Res(resid.residue_name,
                            //                            resid.phi,
                            //                            resid.psi,
                            //                            resid.rama,
                            //                            chain.chain_id,
                            //                            resid.residue_number));
                            //         break;
                            //     case 'OUTLIER':
                            //         outl.push(new Res(resid.residue_name,
                            //                           resid.phi,
                            //                           resid.psi,
                            //                           resid.rama,
                            //                           chain.chain_id,
                            //                           resid.residue_number));
                            //         break;
                            //     default:
                            //         continue;
                            // }
                        }
                    }
                }
            }
            xmlHttp.open('GET',
                         'https://www.ebi.ac.uk/pdbe/api/validation/residuewise_outlier_summary/entry/' + this.pdbID,
                         false);
            xmlHttp.send();
            // if (xmlHttp.status !== 200) {
            //     return [];
            // }
            // else {
            const mols = JSON.parse(xmlHttp.responseText)[this.pdbID];
            for (const mol of mols.molecules) {
                for (const chain of mol.chains) {
                    for (const mod of chain.models) {
                        for (const res of mod.residues) {
                            if (res.outlier_types[0] === 'RSRZ') {
                                this._rsrz[res.residue_number] = {outliersType: res.outlier_types};
                            } else {
                                this._outlDict[res.residue_number] = {outliersType: res.outlier_types};
                            }

                        }
                    }

                }
            }
                // }
            // console.log(list);
            //
        }
    }
    get chainsArray(): string[] {
        return this._chainsArray;
    }

    get modelArray(): number[] {
        return this._modelArray;
    }

    get residueArray(): object[] {
        return this._residueArray;
    }
    get rsrz(): { [p: number]: Dictionary } {
        return this._rsrz;
    }

    get outlDict(): { [p: number]: Dictionary } {
        return this._outlDict;
    }

}
// }
        // let response = await fetch('http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/'
        //     + this.pdbID);
        // if (response.status >= 400) {
        //     throw new Error('Bad response from server');
        // }
        // let data = await  response.json();
        // return data[this.pdbID].molecules;
    //     fetch('http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + this.pdbID)
    //             .then(response => {
    //                 if (response.status >= 400) {
    //                     throw new Error('Bad response from server');
    //                 }
    //                 response.json().then(data => ({
    //                     data: data,
    //                     status: response.status
    //                 }))
    //                     .then(res => {
    //                         return res.data[this.pdbID].molecules;
    //                     });
    //                 // return response.json()[this.pdbID];
    //             });
    // }

// class RamaData {
//     pdb: string;
//
//     constructor(pdbID: string) {
//         this.pdb = pdbID;
//         fetch('http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + this.pdb)
//                 .then(response =>
//                     response.json().then(data => ({
//                             data: data,
//                             status: response.status
//                         })
//                     ).then(res => {
//                         for (let mol of res.data[this.pdb].molecules) {
//                             new Molecule(mol.entity_id, mol.chains);
//                         }
//                     }));
//     }
// }
//
// class Molecule {
//     private _chains: Array<ChainClass> = [];
//
//     constructor(public _entityId: number, public _chainObj: object[]) {
//
//         for (let chan of this._chainObj) {
//             let Chain = new ChainClass(chan['chain_id'], chan['models']);
//             this._chains.push(Chain);
//         }
//     }
//
//     public get entityId(): number {
//         return this._entityId;
//     }
//
//     public get chainObj(): Object[] {
//         return this._chainObj;
//     }
//     get chains(): Array<ChainClass> {
//         return this._chains;
//     }
// }
//
// class ChainClass {
//     private _mods: Array<ModelClass> = [];
//
//     constructor(public _chainID: symbol, public _models: object[]) {
//         for (let mod of this._models) {
//             let tempMod = new ModelClass(mod['model_id'], mod['residues']);
//             this.models.push(tempMod);
//         }
//     }
//
//     get mods(): Array<ModelClass> {
//         return this._mods;
//     }
//
//     public get chainID(): symbol {
//         return this._chainID;
//     }
//
//     public get models(): Object[] {
//         return this._models;
//     }
// }
//
// class ModelClass {
//     constructor(public modelID: number, public residues: object[]) {
//         for (let res of residues) {
//             new ResidueClass(res);
//         }
//
//     }
// }
// class ResidueClass extends React.Component {
//     private _psi: number;
//     private _residueNumber: number;
//     private _rama: string;
//     private _phi: number;
//     private _residueName: string;
//     private _rota: string;
//
//     constructor(public residue: object) {
//         super(residue);
//         this._psi = residue['_psi'];
//         this._phi = residue['_phi'];
//         this._residueName = residue['residue_name'];
//         this._residueNumber = residue['residue_number'];
//         this._rama = residue['_rama'];
//         this._rota = residue['_rota'];
//     }
//
//     get psi(): number {
//         return this._psi;
//     }
//
//     get residueNumber(): number {
//         return this._residueNumber;
//     }
//
//     get rama(): string {
//         return this._rama;
//     }
//
//     get phi(): number {
//         return this._phi;
//     }
//
//     get residueName(): string {
//         return this._residueName;
//     }
//
//     get rota(): string {
//         return this._rota;
//     }
//
//     render() {
//         return (
//             <div className="parsed-pdb">
//                 {this._phi} " " {this._psi} " " {this._rama}
//             </div>
//         );
//     }
//
// }

// function Download(pdbID: string) {
//     return (
//         new RamaData(pdbID)
//     );
// }
// export default Molecule;

export default ParsePDB;