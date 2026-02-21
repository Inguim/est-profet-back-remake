import type { Knex } from "knex";
import { v4 as uuidV4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
	await knex("categorias").del();

	const { id } = await knex("menus").select("id").where({ nome: "Categorias" }).first();

	await knex("categorias").insert([
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Ciências Agrárias",
			slug: "ciencias-agrarias",
			descricao:
				"É a área que visa a busca do aprimoramento técnico, o aumento produtivo e melhorias no manejo e preservação dos recursos naturais, sendo os seus profissionais capazes de propor soluções através do entendimento de produção agropecuária, comercialização dos produtos e preservação ambiental. Não levando em conta o desenvolvimento de projetos, que seria basicamente o desenvolvimento de técnicas de melhorias dentro e fora do campus, seja na correção de um solo ou formas alternativas de produzir algo de origem animal ou vegetal",
		},
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Ciências Biológicas",
			slug: "ciencias-biologicas",
			descricao:
				"O termo Ciências Biológicas se refere aos estudos de diferentes seres vivos como plantas, animais, bactérias, etc. Ou seja, Ciências Biológicas é o estudo da Biologia como ciência, que abrange o funcionamento de organismos vivos de diferentes portes, desde escala microscópica até populações inteiras de diferentes formas de vida",
		},
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Ciências da Saúde",
			slug: "ciencias-da-saude",
			descricao:
				"As Ciências da Saúde são aquelas que estão preocupadas com o corpo e a saúde, seja humana ou animal. São aquelas que pesquisam doenças físicas e tentam encontrar formas de erradica-las ou ao menos reduzi-las, além de tentar trazer conforto para o corpo. Como exemplo disso, nós temos a Educação física e a Fisioterapia",
		},
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Ciências Exatas e da Terra",
			slug: "ciencias-exatas-e-da-terra",
			descricao:
				"São as áreas ligadas a cálculos, estatísticas e projeções físicas ou matemáticas, além de exatidão computacional e todas as suas ramificações. Exemplos disso são Matemática, Ciências da Computação e Geografia",
		},
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Ciências Humanas",
			slug: "ciencias-humanas",
			descricao:
				"São as áreas voltadas para o conhecimento humano, seja analisando acontecimentos através do tempo até os dias de hoje, seja pela escrita ou seja através de pensadores. História, Letras e Filosofia integram essa categoria",
		},
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Ciências Sociais Aplicadas",
			slug: "ciencias-sociais-aplicadas",
			descricao:
				"As Ciências Sociais Aplicadas reúne campos de conhecimento interdisciplinares, voltados para os aspectos sociais das diversas realidades humanas. Ou seja, entender quais são as necessidades da sociedade e, também, quais são as consequências de viver em sociedade",
		},
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Engenharias",
			slug: "engenharias",
			descricao:
				"As Engenharias são a área da aplicação, onde se coloca em prática diversos conceitos aprendidos na teoria, como a engenharia civil que constroi edificações a partir de cálculos, geometria, etc; e a engenharia computacional, que se preocupada com o hardware (parte física do computador)",
		},
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Linguística, Letras e Artes",
			slug: "linguistica-letras-e-artes",
			descricao:
				"As áreas de Linguística, Letras e Artes trabalha na elaboração de material didático e projetos de alfabetização, viabilizando e facilitando a comunicação entre os seres humanos, além de se voltar para expressão artística e cultural",
		},
		{
			id: uuidV4(),
			menu_id: id,
			nome: "Multidisciplinar",
			slug: "multidisciplinar",
			descricao: "São os projetos que englobam mais de uma área, independente de qual sejam elas",
		},
	]);
}
