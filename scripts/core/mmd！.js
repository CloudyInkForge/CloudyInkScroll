;function mmd(src)
{
	// 定义一个变量h，用于存储处理后的字符串
	var h='';

	// 定义一个函数escape，用于转义字符串
	function escape(t)
	{
		// 使用Option对象的innerHTML属性进行转义
		return new Option(t).innerHTML;
	}
	// 定义一个函数inlineEscape，用于处理行内元素
	function inlineEscape(s)
	{
		// 将字符串中的图片、链接、代码、粗体和斜体替换为对应的HTML标签
		return escape(s)
			.replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">')
			.replace(/\[([^\]]+)]\(([^(]+?)\)/g, '$1'.link('$2'))
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, '<strong>$2</strong>')
			.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>');
	}

	// 去除字符串两端的空格、换行符和制表符，并将字符串按换行符分割成数组
	src
	.replace(/^\s+|\r|\s+$/g, '')
	.replace(/\t/g, '    ')
	.split(/\n\n+/)
	.forEach(function(b, f, R)
	{
		// 获取当前行的第一个字符
		f=b[0];
		// 定义一个对象R，用于存储不同类型的行对应的HTML标签和分隔符
		R=
		{
			'*':[/\n\* /,'<ul><li>','</li></ul>'],
			'1':[/\n[1-9]\d*\.? /,'<ol><li>','</li></ol>'],
			' ':[/\n    /,'<pre><code>','</code></pre>','\n'],
			'>':[/\n> /,'<blockquote>','</blockquote>','\n']
		}[f];
		// 根据不同类型的行，生成对应的HTML标签
		h+=
			R?R[1]+('\n'+b)
				.split(R[0])
				.slice(1)
				.map(R[3]?escape:inlineEscape)
				.join(R[3]||'</li>\n<li>')+R[2]:
			f=='#'?'<h'+(f=b.indexOf(' '))+'>'+inlineEscape(b.slice(f+1))+'</h'+f+'>':
			f=='<'?b:
			'<p>'+inlineEscape(b)+'</p>';
	});
	// 返回处理后的字符串
	return h;
};
