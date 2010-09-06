function alterarDesenvolvedores(icone) {
	$('.desenvolvedor').css('display', 'inline');
	$(icone).hide();
}

function alterarTestadores(icone) {
	$('.testador').css('display', 'inline');
	$(icone).hide();
}

function toogleDesenvolvedor(username) {
	var $imagem = $('#dev_img_' + username);
	var $campo = $('#dev_chk_' + username);

	if ($imagem.hasClass('ativo')) {
		$imagem.removeClass('ativo');
		$imagem.addClass('inativo');
		$campo.removeAttr('checked');
	} else {
		$imagem.removeClass('inativo');
		$imagem.addClass('ativo');
		$campo.attr('checked', 'checked');
	}
}

function toogleTestador(username) {
	var $imagem = $('#tes_img_' + username);
	var $campo = $('#tes_chk_' + username);

	if ($imagem.hasClass('ativo')) {
		$imagem.removeClass('ativo');
		$imagem.addClass('inativo');
		$campo.removeAttr('checked');
	} else {
		$imagem.removeClass('inativo');
		$imagem.addClass('ativo');
		$campo.attr('checked', 'checked');
	}
}

var alterarPrioridadeDaTarefa = function(ui, event) {
	var $tarefas = $('#listaTarefas li');
	var novaOrdem = new Array($tarefas.length);
	var indice = 0;
	$tarefas.each(function(i, el) {
		novaOrdem[indice++] = el.id;
	});
	$.post(pronto.raiz + 'tickets/' + ticketKey + '/ordenar', {
		'ticketKey' : novaOrdem
	});
};

$(function() {
	$('#formTicket').validate();
	$("#descricao").markItUp(mySettings);
	$("#comentario").markItUp(mySettings);
	$("#comentarioZendesk").markItUp({onShiftEnter:	{keepDefault:false, replaceWith:'\n\n'},markupSet: []});
	$("#titulo").focus();
	$("#dialog").dialog( {
		autoOpen : false,
		height : $(document).height() - 50,
		width : $(document).width() - 50,
		modal : true
	});
	$("#listaTarefas").sortable( {
		placeholder : 'ui-state-highlight',
		stop : alterarPrioridadeDaTarefa
	});
	$("#listaTarefas").disableSelection();
});

function adicionarScript() {
	goTo(pronto.raiz + 'scripts/novo?ticketKey=' + ticketKey);
}

function editarScript() {
	goTo(pronto.raiz + 'scripts/' + scriptKey);
}

function excluirAnexo(ticketKey, anexo) {
	if (confirm('Tem certeza que deseja excluir este anexo?')) {
		pronto.doDelete(pronto.raiz + 'tickets/' + ticketKey + '/anexos/', [ {
			name : 'file',
			value : anexo
		} ]);
	}
}

function verDescricao(ticketKey) {
	$.ajax( {
		url : pronto.raiz + 'tickets/' + ticketKey + '/descricao',
		cache : false,
		success : function(data) {
			$("#dialog").dialog(
					'option',
					'title',
					'#' + ticketKey + ' - '
							+ $('#' + ticketKey + ' .titulo').text());
			$("#dialogDescricao").html(data);
			$("#dialog").dialog('open');
		}
	});
}

function salvar() {
	$('#formTicket').submit();
}

function alterarStatuDoKanban() {
	var kanbanStatusAnterior = $("#kanbanStatusAnterior").val();
	var kanbanStatusKey = $("#kanbanStatusKey").val();
	var $motivoReprovacaoCombo = $("#motivoReprovacaoKey");
	var $motivoReprovacaoDiv = $("#motivoReprovacaoDiv");
	
	if (parseInt(ordens[kanbanStatusAnterior]) > parseInt(ordens[kanbanStatusKey])) {
		$motivoReprovacaoCombo.addClass('requiredCombo');
		$motivoReprovacaoDiv.show();
	} else {
		$motivoReprovacaoCombo.removeClass('requiredCombo');
		$motivoReprovacaoDiv.hide();
	}
}

function buscarTicketDeOrigem(ticketKey) {
	openWindow(pronto.raiz+"tickets/"+ticketKey+"/selecionarOrigem", 'selecaoDeOrigem');
}

function definirOrigem(ticketKey, ticketOrigemKey) {
	$("#descricaoOrigem").text("");
	$("<b>Origem: <a style='cursor:pointer' onclick='abrirTicket("+ticketOrigemKey+")'>#"+ticketOrigemKey+"</a></b>").appendTo("#descricaoOrigem");
	$("<img src='"+iconsFolder+"/excluir.png' title='Excluir esta origem' onclick='excluirTicketDeOrigem("+ticketKey+");'/>").appendTo("#descricaoOrigem");
}

function abrirTicket(ticketKey) {
	openWindow(pronto.raiz+"tickets/"+ticketKey, 'ticketKeyOrigem');
}

function excluirTicketDeOrigem(ticketKey) {
	pronto.doPost(pronto.raiz+"tickets/"+ticketKey+"/excluirTicketDeOrigem");
}

$(function(){
	$("#motivoReprovacaoDiv").hide();
});