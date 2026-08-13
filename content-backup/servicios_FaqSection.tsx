import { Container } from "@/components/layout/Container";
import { Accordion } from "@/components/ui/Accordion";

const FAQ_ITEMS = [
  {
    question: "¿Trabajáis solo en Alzira o también en otras zonas?",
    answer:
      "Aunque el estudio está en Alzira, desarrollamos proyectos en toda la provincia de Valencia y alrededores. Dependiendo del proyecto, valoramos otras ubicaciones.",
  },
  {
    question: "¿Trabajáis en viviendas de obra nueva?",
    answer:
      "Sí, trabajamos tanto en reformas como en proyectos de obra nueva, adaptándonos a las necesidades de cada cliente y al tipo de vivienda.",
  },
  {
    question: "¿Cuándo es recomendable contar con vosotros en una obra nueva?",
    answer:
      "Lo ideal es incorporarnos desde el inicio, en coordinación con el arquitecto. Esto nos permite trabajar el espacio de forma conjunta desde el principio y evitar decisiones que puedan condicionar el resultado final.",
  },
  {
    question: "¿Podéis recomendar arquitectos?",
    answer:
      "Sí, en caso de no contar con arquitecto, podemos proponerte profesionales de nuestra confianza en función del tipo de proyecto, con los que compartimos forma de trabajar y criterio.",
  },
  {
    question: "¿Puedo contratar solo el diseño sin la ejecución?",
    answer:
      "Sí, ofrecemos servicio de interiorismo independiente. Sin embargo, cuando desarrollamos también la ejecución, podemos garantizar un mayor control sobre el resultado final y la coherencia del proyecto.",
  },
  {
    question: "¿Ejecutáis proyectos que no habéis diseñado vosotros?",
    answer:
      "No. Solo ejecutamos proyectos desarrollados por el estudio. Es la única forma de asegurar que lo que se construye responde exactamente a lo que se ha proyectado.",
  },
  {
    question: "¿Hacéis reformas parciales o solo integrales?",
    answer:
      "Trabajamos principalmente proyectos completos, donde podemos aportar una visión global y coherente. En casos puntuales, valoramos intervenciones más concretas si encajan con nuestra forma de trabajar.",
  },
  {
    question: "¿Cuánto cuesta un proyecto?",
    answer:
      "Cada proyecto es diferente, por lo que no trabajamos con precios estándar. El coste depende del alcance, el estado inicial de la vivienda y el nivel de intervención. Lo que sí garantizamos es una propuesta clara y detallada antes de empezar.",
  },
  {
    question: "¿Cuánto dura una reforma?",
    answer:
      "Los plazos varían según el tipo de proyecto, pero siempre se definen antes de iniciar la obra. Nuestro objetivo es que el proceso sea ordenado y sin improvisaciones.",
  },
  {
    question: "¿Tengo que estar pendiente de la obra?",
    answer:
      "No. Nos encargamos de coordinar y supervisar todos los trabajos. Mantenemos una comunicación constante contigo y realizamos reuniones periódicas, pero no tendrás que gestionar el día a día.",
  },
  {
    question: "¿Qué pasa si surgen imprevistos?",
    answer:
      "En cualquier obra pueden aparecer situaciones no previstas. Nuestro trabajo es anticiparnos en la medida de lo posible y, si surgen, resolverlas con criterio y transparencia.",
  },
  {
    question: "¿Trabajáis con proveedores propios?",
    answer:
      "Sí, contamos con un equipo de industriales y proveedores de confianza con los que trabajamos de forma habitual, lo que nos permite mantener un mayor control sobre la calidad y los tiempos.",
  },
  {
    question: "¿Qué tipo de proyectos encajan con vosotros?",
    answer:
      "Trabajamos en proyectos donde tiene sentido replantear el espacio desde la base, buscando soluciones duraderas y coherentes. No nos enfocamos en intervenciones superficiales.",
  },
];

export function FaqSection() {
  return (
    <section className="pt-[120px] pb-[120px]">
      <Container>
        <h2 className="font-title text-primary text-3xl uppercase md:text-4xl">
          Antes de empezar
          <br />
          el proyecto
        </h2>

        <Accordion items={FAQ_ITEMS} className="mt-title" />
      </Container>
    </section>
  );
}
