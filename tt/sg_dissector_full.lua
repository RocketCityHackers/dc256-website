-- Signal Generator Wireshark Dissector

local sg = Proto("sg", "Signal Generator Protocol")

-- Request fields
local f_magic        = ProtoField.string("sg.magic", "Magic")
local f_waveform     = ProtoField.uint8("sg.waveform", "Waveform")
local f_flags        = ProtoField.uint16("sg.flags", "Flags", base.HEX)
local f_flag_output  = ProtoField.bool("sg.flags.output_enable", "Output Enable", 16, nil, 0x0001)
local f_flag_sync    = ProtoField.bool("sg.flags.sync_pulse", "Sync Pulse", 16, nil, 0x0004)
local f_flag_hiz     = ProtoField.bool("sg.flags.high_z", "High-Z", 16, nil, 0x0008)
local f_dc_offset    = ProtoField.int16("sg.dc_offset_mv", "DC Offset (mV)")
local f_duty_cycle   = ProtoField.uint8("sg.duty_cycle", "Duty Cycle")
local f_noise_level  = ProtoField.uint8("sg.noise_level", "Noise Level")
local f_frequency    = ProtoField.float("sg.frequency", "Frequency (Hz)")
local f_amplitude    = ProtoField.float("sg.amplitude", "Amplitude (V)")
local f_phase        = ProtoField.int32("sg.phase", "Phase (deg)")
local f_sequence     = ProtoField.uint64("sg.sequence", "Sequence")

-- Response fields
local f_status       = ProtoField.uint8("sg.status", "Status")
local f_sample_count = ProtoField.uint16("sg.sample_count", "Sample Count")
local f_padding      = ProtoField.uint16("sg.padding", "Padding", base.HEX)
local f_peak         = ProtoField.float("sg.peak", "Peak Amplitude")
local f_rms          = ProtoField.float("sg.rms", "RMS Value")
local f_sample       = ProtoField.int16("sg.sample", "Sample")

sg.fields = {
    f_magic, f_waveform, f_flags,
    f_flag_output, f_flag_sync, f_flag_hiz,
    f_dc_offset, f_duty_cycle,
    f_noise_level, f_frequency, f_amplitude, f_phase, f_sequence,
    f_status, f_sample_count, f_padding, f_peak, f_rms, f_sample
}

local waveform_names = {
    [0] = "Sine", [1] = "Square", [2] = "Sawtooth", [3] = "Triangle"
}

local status_names = {
    [0] = "OK", [1] = "Bad Parameter", [2] = "Overload", [3] = "Clipped"
}

function sg.dissector(buffer, pinfo, tree)
    local length = buffer:len()
    if length < 3 then return end

    local magic = buffer(0, 3):string()
    if magic ~= "SGC" and magic ~= "SGS" then return end

    pinfo.cols.protocol:set("SG")

    if magic == "SGC" and length == 30 then
        -- Request
        pinfo.cols.info:set("SG Request")
        local subtree = tree:add(sg, buffer(), "Signal Generator Request")

        subtree:add(f_magic, buffer(0, 3))

        local wf = buffer(3, 1):uint()
        local wf_item = subtree:add(f_waveform, buffer(3, 1))
        if waveform_names[wf] then
            wf_item:append_text(" (" .. waveform_names[wf] .. ")")
        end

        local flags_tree = subtree:add(f_flags, buffer(4, 2))
        flags_tree:add(f_flag_output, buffer(4, 2))
        flags_tree:add(f_flag_sync, buffer(4, 2))
        flags_tree:add(f_flag_hiz, buffer(4, 2))

        subtree:add(f_dc_offset, buffer(6, 2))
        subtree:add(f_duty_cycle, buffer(8, 1)):set_text(string.format("Duty Cycle: %.1f%%", buffer(8, 1):uint() / 255.0 * 100.0))
        subtree:add(f_noise_level, buffer(9, 1))
        subtree:add(f_frequency, buffer(10, 4))
        subtree:add(f_amplitude, buffer(14, 4))
        subtree:add(f_phase, buffer(18, 4)):set_text(string.format("Phase: %.3f deg", buffer(18, 4):int() / 1000.0))
        subtree:add(f_sequence, buffer(22, 8))

    elseif magic == "SGS" and length >= 24 then
        -- Response
        local sc = buffer(4, 2):uint()
        pinfo.cols.info:set("SG Response (" .. sc .. " samples)")
        local subtree = tree:add(sg, buffer(), "Signal Generator Response")

        subtree:add(f_magic, buffer(0, 3))

        local st = buffer(3, 1):uint()
        local st_item = subtree:add(f_status, buffer(3, 1))
        if status_names[st] then
            st_item:append_text(" (" .. status_names[st] .. ")")
        end

        subtree:add(f_sample_count, buffer(4, 2))
        subtree:add(f_padding, buffer(6, 2))
        subtree:add(f_sequence, buffer(8, 8))
        subtree:add(f_peak, buffer(16, 4))
        subtree:add(f_rms, buffer(20, 4))

        if sc > 0 and length >= 24 + sc * 2 then
            local samples_tree = subtree:add(sg, buffer(24, sc * 2), "Samples (" .. sc .. ")")
            for i = 0, sc - 1 do
                local off = 24 + i * 2
                local raw = buffer(off, 2):int()
                samples_tree:add(f_sample, buffer(off, 2)):set_text(
                    string.format("Sample[%d]: %d (%.4f V)", i, raw, raw / 32767.0 * 10.0)
                )
            end
        end
    end
end

local ws_dissector_table = DissectorTable.get("ws.port")
ws_dissector_table:add(9337, sg)