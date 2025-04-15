
type Book = {
    id: number;
    title: string;
    photoPath: string;
    size: 'small' | 'medium' | 'large'; // ou só string se for mais flexível
  };
  

  export const mockReadBooks: Book[] = [
    {
      id: 1,
      title: 'O Alquimista',
      photoPath: 'https://static.wixstatic.com/media/31a549_7dffb191bffa440686e5a148b8e042d9~mv2.jpg',
      size: 'small',
    },
    {
      id: 2,
      title: 'Dom Casmurro',
      photoPath: 'https://editoragente.vtexassets.com/arquivos/ids/156307/capa_frente_alem_da_capa.jpg?v=638666063330400000',
      size: 'small',
    },
    {
      id: 3,
      title: 'A Revolução dos Bichos',
      photoPath: 'https://marketplace.canva.com/EAFvcNo2Rmg/1/0/1003w/canva-capa-de-livro-sobre-psicologia-e-tecnologia-moderno-azul-escuro-tJium1eKIhc.jpg',
      size: 'small',
    },
    {
      id: 4,
      title: 'O Pequeno Príncipe',
      photoPath: 'https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg',
      size: 'small',
    },
    {
      id: 5,
      title: 'A Cabana',
      photoPath: 'https://temporalcerebral.com.br/wp-content/uploads/2017/06/melhores-capas-livros-2016-on-trails-robert-an-exploration-robert-moor.jpg',
      size: 'small',
    },
    {
      id: 6,
      title: 'Harry Potter e a Pedra Filosofal',
      photoPath: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L.jpg',
      size: 'small',
    },
    {
      id: 7,
      title: 'O Código Da Vinci',
      photoPath: 'https://cirandacultural.fbitsstatic.net/img/p/livro-capa-dura-365-historias-para-ler-e-sonhar-74282/260810.jpg?w=520&h=520&v=no-change&qs=ignore',
      size: 'small',
    },
    {
      id: 8,
      title: 'As Aventuras de Sherlock Holmes',
      photoPath: 'https://harpercollins.com.br/cdn/shop/products/9786555114249.jpg?v=1691738136',
      size: 'small',
    },
    {
      id: 9,
      title: 'Senhor dos Anéis: A Sociedade do Anel',
      photoPath: 'https://images-americanas.b2w.io/produtos/01/00/img/128898/3/128898358_2GG.jpg',
      size: 'small',
    },
    {
      id: 10,
      title: 'Percy Jackson e o Ladrão de Raios',
      photoPath: 'https://ocapista.com.br/imgs/capas/fantasia_capa_livro.jpg',
      size: 'small',
    },
    {
      id: 11,
      title: 'It: A Coisa',
      photoPath: 'https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg',
      size: 'small',
    },
    {
      id: 12,
      title: 'O Hobbit',
      photoPath: 'https://m.media-amazon.com/images/I/81t2CVWEsUL.jpg',
      size: 'small',
    },
  ];

  
  export const mockReadingBooks: Book[] = [
    {
      id: 3,
      title: '1984',
      photoPath: 'https://www.designcomcafe.com.br/wp-content/uploads/2017/08/capas-de-livros-the-old-man-and-the-sea-02.jpg',
      size: 'small',
    },
    {
      id: 4,
      title: 'Capitães da Areia',
      photoPath: 'https://marketplace.canva.com/EAD0UPCkitY/1/0/1024w/canva-capa-de-livro-de-suspense-monocrom%C3%A1tica-com-foto-de-floresta-U1dpnJ3bwKw.jpg',
      size: 'small',
    },
  ];
  
  export const mockToReadBooks: Book[] = [
    {
      id: 5,
      title: 'Sapiens',
      photoPath: 'https://i0.wp.com/editoraflutuante.com.br/wp-content/uploads/2018/08/Quarta-Capa-Frente-1.jpg?fit=818%2C1240&ssl=1',
      size: 'small',
    },
    {
      id: 6,
      title: 'Clean Code',
      photoPath: 'https://img.wattpad.com/cover/332203689-288-k968886.jpg',
      size: 'small',
    },
  ];