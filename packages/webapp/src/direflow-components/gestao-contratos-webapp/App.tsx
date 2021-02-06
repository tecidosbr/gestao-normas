import React, { FunctionComponent, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

import { IcsListDto, NormaListDto, SearchNormaDto } from "../../../../service/src/dto";
import { useFetchApi } from '../../api';

const bodyStyle = {
  margin: 0,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: '1.5',
  color: '#212529'
};

export const App: FunctionComponent = () => {
  const [idToken, setIdToken] = useState<string>('');
  const [searchNormaDto, setSearchNormaDto] = useState<Record<keyof SearchNormaDto, string>>({ search: '*', filter: '' });

  const { data: icss } = useFetchApi<IcsListDto>('ics', idToken);
  const { data: normas } = useFetchApi<NormaListDto>(`norma/search?${new URLSearchParams(searchNormaDto)}`, idToken);

  useEffect(() => {
    setIdToken(sessionStorage.getItem('idToken') ?? '');
  });

  const { register, handleSubmit, reset } = useForm<{
    palavrasChave: string;
    titulo: string;
    ics: string;
  }>();

  const onSubmit = handleSubmit((data) => {
    const search: string[] = [];
    const filters: string[] = [];

    if (data.palavrasChave) {
      search.push(`palavrasChave: "${data.palavrasChave}"`);
    }

    if (data.titulo) {
      search.push(`titulo: "${data.titulo}"`);
    }

    if (data.ics) {
      filters.push(`ics eq '${icss?.list.find(e => e.description === data.ics)?.id}'`);
    }
    setSearchNormaDto({
      search: search.join(' and '),
      filter: filters.join(' and ')
    });
  });

  return (
    <div style={bodyStyle}>
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">
            <i className="bi-filter" />
            <span>Filtros</span>
          </h5>
          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="mb-3 col col-12 col-md-6">
                <label className="form-label">Titulo</label>
                <input ref={register} type="text" className="form-control" name="titulo" />
              </div>
              <div className="mb-3 col col-12 col-md-6">
                <label className="form-label">Palavras Chave</label>
                <input ref={register} type="text" className="form-control" name="palavrasChave" />
              </div>
              <div className="mb-3 col col-12 col-md-6">
                <label className="form-label">ICS/CIN</label>
                <input ref={register} className="form-control" list="icss" name="ics" />
                <datalist id="icss">
                  {icss?.list?.map(c => (
                    <option key={c.id} value={c.description} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
              <div className="btn-group me-2">
                <input type="submit" className="btn btn-primary" value="Buscar" />
              </div>
              <div className="btn-group">
                <button className="btn btn-outline-secondary" onClick={() => reset()}>Limpar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="card my-3">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col" className="d-none d-md-table-cell">Titulo</th>
                  <th scope="col" className="d-none d-md-table-cell">Palavras Chave</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {normas?.list?.map(n => (
                  <tr key={n.id}>
                    <th>{n.codigo}</th>
                    <td className="d-none d-md-table-cell">{n.titulo}</td>
                    <td className="d-none d-md-table-cell">{n.palavrasChave.join(', ')}</td>
                    <td>
                      <a type="button" className="btn btn-primary" target="_blank" rel="noopener noreferrer" href={`https://sigo.blob.core.windows.net/gestao-normas/${n.filename}`}>
                        <i className="bi-download" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
