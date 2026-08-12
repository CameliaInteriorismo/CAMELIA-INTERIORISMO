/**
 * Aviso Legal, transcribed verbatim from the text the studio supplied.
 *
 * Legal copy is quoted, not edited: nothing here is reworded, shortened or
 * reordered, and the closing editorial note that came with the source
 * ("Este texto es perfectamente válido como base para Camelia…") is left
 * out because it describes the document rather than forming part of it.
 *
 * El domicilio se escribe en la forma legal confirmada por el estudio, en una
 * línea y con planta. La misma dirección aparece rotulada en tres líneas en
 * el footer y en Contacto (ver CONTACT en features/contacto/data.ts), y en
 * los enlaces a Maps sin la planta: son presentaciones distintas del mismo
 * dato, no variantes sueltas.
 *
 * El teléfono de abajo (601 531 301) ya coincide con el del footer y el de
 * Contacto: es el mismo número, y solo cambia la agrupación de los dígitos,
 * que aquí se respeta tal como la escribe el texto legal.
 */

import type { LegalSection } from "@/features/legal/types";

export const AVISO_LEGAL_SECTIONS: LegalSection[] = [
  {
    number: "1",
    title: "Responsable titular del sitio web",
    blocks: [
      {
        type: "details",
        entries: [
          { label: "Nombre comercial", value: "CAMELIA" },
          { label: "Titular", value: "Laura Castillo Valverde" },
          {
            label: "Domicilio",
            value: "Av. Hispanitat, 4, Entresuelo 1, 46600, Alzira (Valencia)",
          },
          { label: "NIF", value: "20850524N" },
          {
            label: "Teléfono",
            value: "601 531 301",
            href: "tel:+34601531301",
          },
          {
            label: "Correo electrónico",
            value: "info@cameliainteriorismo.com",
            href: "mailto:info@cameliainteriorismo.com",
          },
          {
            label: "Sitio web",
            value: "cameliainteriorismo.com",
            href: "https://cameliainteriorismo.com",
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Laura Castillo Valverde, titular de la marca comercial CAMELIA, es la responsable del presente sitio web y se compromete a cumplir con la normativa vigente en materia de protección de datos personales y servicios de la sociedad de la información.",
          "Este sitio web garantiza la protección y confidencialidad de los datos personales facilitados por sus usuarios, de conformidad con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), así como la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).",
        ],
      },
    ],
  },
  {
    number: "2",
    title: "Objeto",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "El presente sitio web tiene por objeto facilitar información sobre los servicios y proyectos desarrollados por CAMELIA, así como permitir el contacto con personas interesadas en los mismos.",
          "El acceso y utilización del sitio web atribuye la condición de Usuario e implica la aceptación íntegra del presente Aviso Legal y de todas sus condiciones.",
          "La prestación del servicio del sitio web tiene una duración limitada al momento en que el Usuario permanezca conectado al mismo o haga uso de cualquiera de los servicios ofrecidos.",
          "Por ello, el Usuario deberá leer atentamente este Aviso Legal cada vez que acceda al sitio web, ya que podrá ser objeto de modificaciones.",
        ],
      },
    ],
  },
  {
    number: "3",
    title: "Acceso y utilización del sitio web",
    blocks: [
      {
        type: "subsection",
        title: "3.1 Carácter gratuito",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "El acceso al sitio web es gratuito para todos los usuarios, sin perjuicio del coste de conexión a Internet contratado con su proveedor de servicios.",
            ],
          },
        ],
      },
      {
        type: "subsection",
        title: "3.2 Registro de usuarios",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Con carácter general, el acceso y utilización del sitio web no requiere registro previo.",
            ],
          },
        ],
      },
      {
        type: "subsection",
        title: "3.3 Veracidad de los datos",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "El Usuario garantiza que los datos personales facilitados son veraces, exactos y se encuentran actualizados, comprometiéndose a comunicar cualquier modificación de los mismos.",
              "El Usuario acepta facilitar información completa y correcta a través de los formularios habilitados en el sitio web.",
              "En ningún caso se solicitarán datos personales de menores relativos a la situación profesional, económica o familiar de sus progenitores sin su consentimiento.",
              "Si eres menor de 14 años, deberás contar con la autorización de tus padres o representantes legales antes de facilitar cualquier dato personal.",
              "En CAMELIA respetamos la privacidad de nuestros usuarios y tratamos sus datos personales conforme a la normativa vigente.",
            ],
          },
        ],
      },
    ],
  },
  {
    number: "4",
    title: "Contenidos del sitio web",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "El idioma principal del sitio web es el castellano.",
          "CAMELIA podrá modificar, actualizar, eliminar o reorganizar los contenidos del sitio web, así como la forma de acceso a los mismos, sin necesidad de previo aviso.",
          "Queda prohibida la utilización de los contenidos del sitio web para fines comerciales, publicitarios o de difusión sin la autorización expresa y por escrito de Laura Castillo Valverde.",
          "Los enlaces que terceros incorporen hacia este sitio web deberán dirigir siempre a la página principal, sin que puedan realizar manifestaciones falsas, inexactas o que induzcan a error sobre CAMELIA o sus servicios.",
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Medidas de seguridad",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Los datos personales facilitados podrán ser almacenados en bases de datos cuya titularidad corresponde exclusivamente a Laura Castillo Valverde.",
          "Se aplicarán las medidas técnicas y organizativas necesarias para garantizar la seguridad, confidencialidad, integridad y disponibilidad de los datos personales, conforme a la normativa vigente en materia de protección de datos.",
        ],
      },
    ],
  },
  {
    number: "6",
    title: "Limitación de responsabilidad",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "El acceso y utilización del sitio web es responsabilidad exclusiva del Usuario.",
          "CAMELIA no será responsable de los daños o perjuicios que pudieran derivarse del acceso o utilización del sitio web, incluyendo aquellos ocasionados por:",
        ],
      },
      {
        type: "list",
        items: [
          "La presencia de virus u otros elementos informáticos dañinos.",
          "Errores o fallos en el navegador utilizado.",
          "Uso de versiones no actualizadas del navegador.",
          "Interrupciones o incidencias técnicas ajenas al control del titular.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "Asimismo, CAMELIA no garantiza la disponibilidad permanente de los enlaces externos existentes en el sitio web ni se responsabiliza de los contenidos o servicios ofrecidos por terceros.",
        ],
      },
    ],
  },
  {
    number: "7",
    title: "Uso de cookies",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Este sitio web puede utilizar cookies propias y de terceros para mejorar la experiencia de navegación del Usuario.",
          "Toda la información relativa a su utilización puede consultarse en la correspondiente Política de Cookies, que forma parte integrante del presente Aviso Legal.",
        ],
      },
    ],
  },
  {
    number: "8",
    title: "Navegación",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Los servidores del sitio web podrán registrar datos técnicos necesarios para el correcto funcionamiento del servicio, incluyendo direcciones IP y otra información de carácter exclusivamente técnico.",
          "Estos datos podrán utilizarse con fines estadísticos de forma anonimizada y para garantizar la seguridad y correcto funcionamiento del sitio web.",
        ],
      },
    ],
  },
  {
    number: "9",
    title: "Propiedad intelectual e industrial",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Todos los contenidos del presente sitio web, incluyendo de forma enunciativa y no limitativa:",
        ],
      },
      {
        type: "list",
        items: [
          "textos,",
          "fotografías,",
          "renders,",
          "imágenes,",
          "vídeos,",
          "planos,",
          "proyectos,",
          "logotipos,",
          "identidad visual,",
          "diseños,",
          "elementos gráficos,",
          "código fuente,",
          "estructura y diseño del sitio web,",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "son titularidad de Laura Castillo Valverde, de la marca comercial CAMELIA, o se utilizan con la correspondiente autorización de sus titulares, encontrándose protegidos por la legislación vigente en materia de propiedad intelectual e industrial.",
          "Queda prohibida su reproducción, distribución, transformación, comunicación pública o cualquier otra forma de explotación, total o parcial, sin autorización previa y por escrito del titular.",
        ],
      },
    ],
  },
  {
    number: "10",
    title: "Legislación aplicable y jurisdicción",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "El presente Aviso Legal se rige por la legislación española.",
          "Para cualquier controversia derivada del acceso o utilización del sitio web, las partes se someten a los Juzgados y Tribunales del domicilio del Usuario cuando éste tenga la condición de consumidor.",
          "En cualquier otro caso, las partes se someten expresamente a los Juzgados y Tribunales de Valencia, con renuncia a cualquier otro fuero que pudiera corresponderles.",
        ],
      },
    ],
  },
];
