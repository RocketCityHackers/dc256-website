local sg = Proto("sg", "Signal Generator Protocol")

local f_waveform = ProtoField.uint8("sg.waveform", "Waveform")
sg.fields = { f_waveform }

function sg.dissector(buffer, pinfo, tree)
	if buffer:len() ~= 30 then return end

	pinfo.cols.protocol:set("SG")

	local subtree = tree:add(sg, buffer(0,0), "Signal Generator Request")
	subtree:add(f_waveform, buffer(3,1))

	Dissector.get("data"):call(buffer, pinfo, tree)
end

local ws_dissector_table = DissectorTable.get("ws.port")
ws_dissector_table:add(9337, sg)