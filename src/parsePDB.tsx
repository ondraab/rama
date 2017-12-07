import 'isomorphic-fetch';

export class RamaData {
    private pdbID: string;

    constructor(private pdb: string) {
        this.pdbID = this.pdb.toString();
        fetch('http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + this.pdb)
            .then(response =>
                response.json().then(data => ({
                        data: data,
                        status: response.status
                    })
                ).then(res => {
                    for (let mol of res.data[this.pdbID].molecules) {
                        new Molecule(mol.chains);
                    }
                }));
    }
}

class Molecule {

    constructor(private chain: object[]) {
        for (let chan of this.chain) {
            new ChainClass(chan['models']);
        }
    }
}

class ChainClass {

    constructor(private models: object[]) {
        for (let mod of this.models) {
            new ModelClass(mod['residues']);
        }
    }
}

class ModelClass {
    constructor(private residues: object[]) {
        for (let res of this.residues) {
            new ResidueClass(res);
        }

    }
}

class ResidueClass {
    private psi: number;
    private residueNumber: number;
    private rama: string;
    private phi: number;
    private residueName: string;
    private rota: string;
    constructor(private residue: object) {
        this.psi = this.residue['psi'];
        this.phi = this.residue['phi'];
        this.residueName = this.residue['residue_name'];
        this.residueNumber = this.residue['residue_number'];
        this.rama = this.residue['rama'];
        this.rota = this.residue['rota'];
        console.log(this.psi);
    }
}

export default RamaData;
