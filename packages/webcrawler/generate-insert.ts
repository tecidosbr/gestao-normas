import filenamify from 'filenamify';
import normas from './out/normas.json';

for (const [id, n] of Object.entries(normas)) {
    console.log(`
    INSERT INTO normas (id, codigo, titulo, objetivo, ics, palavrasChave, filename)
    VALUES (${id + 1}, '${n.id}', '${n.titulo}', '${n.objetivo}', '${n.ics}', '${JSON.stringify(n.palavrasChave)}', '${filenamify(n.id, { replacement: '_' })}.pdf');`);
}